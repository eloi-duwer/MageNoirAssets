import canvas from 'canvas'
import config from './config'
import Asset from './types/asset'
import fs from 'fs/promises'

export type Cost = ResourceCost | KeywordCost

export type ResourceCost = {
	element: Asset.Element
	quantity: number
	type: 'resource'
}

export type KeywordCost = {
	keyword: string
	quantity: number
	type: 'keyword'
}

export default class Card {
	public name: string
	public id: number
	public type: Asset.CardType
	public element: Asset.Element
	public text: string
	public illustration: string
	public costs: Cost[]
	public keywords: string[]
	public stats?: Asset.Stat[]

	constructor (card: Asset.Card) {
		this.name = card.name
		this.id = card.id
		this.type = this.getType(card.cardTypeId)
		this.text = this.findProperty(card, 'Text', 'Cannot find card text')
		this.element = this.getElement(this.findProperty(card, 'Element', 'unknown'))
		this.illustration = this.findProperty(card, 'Picture', '/placeholder')?.split('/')[1]
		this.costs = this.parseCosts(card)
		this.keywords = this.getKeywords(card)
		if (this.type === 'Permanent')
			this.stats = this.getStats(card)
	}

	private findProperty(cardAsset: Asset.Card, key: string, defaultValue: string) {
		return cardAsset.properties.find(p => p.name === key)?.value ?? defaultValue
	}

	private getType(type: number): Asset.CardType {
		switch(type) {
			case 0:
				return 'Permanent'
			case 1:
				return ''
			case 2:
				return 'Équipement'
			case 3:
				return 'Rituel'
			default:
				console.error(`Unknown card type: ${type}`)
				return 'unknown'
		}
	}

	private getElement(element: string): Asset.Element {
		switch (element) {
			case 'air':
			case 'fire':
			case 'water':
			case 'arcane':
			case 'mineral':
			case 'vegetal':
				return element
			default:
				console.error(`Unknown element: ${element}`)
				return 'unknown'
		}
	}

	private getStats(card: Asset.Card): Asset.Stat[] {
		const ret: Asset.Stat[] = []
		card.stats?.forEach(stat => {
			if (stat.name !== 'Life') {
				console.error(`Unkown stat name ${stat.name}`)
				return
			}
			if (stat.originalValue !== stat.baseValue) {
				console.error(`${card.name}: baseValue and originalValue are different ??!? (${stat.baseValue} and ${stat.originalValue})`)
			}
			ret.push({
				name: stat.name,
				statId: stat.statId,
				baseValue: stat.baseValue,
				originalValue: stat.originalValue,
				modifiers: []
			})
		})
		return ret
	}

	private parseCosts(cardAsset: Asset.Card): Cost[] {
		return cardAsset.costs.map(cost => {
			if (cost.$type === "CCGKit.PayResourceCost") {
				const ret: ResourceCost = {
					element: this.getElement(config.resourcesIds[cost.statId as keyof typeof config.resourcesIds]),
					quantity: cost.baseValue,
					type: 'resource'
				}
				return ret
			} else if (cost.$type === "MageNoir.ComponentCost") {
				const keyword = this.findKeyWord(cost.keywordId, cost.keywordValueId)
				const ret: KeywordCost = {
					keyword: keyword,
					quantity: cost.baseValue,
					type: 'keyword'
				}
				return ret
			}
			else {
				throw new Error (`Unrecognized cost : ${cost}`)
			}
		})
	}

	private getKeywords(card: Asset.Card) {
		return card.keywords.map(keyword => {
			return this.findKeyWord(keyword.keywordId, keyword.keywordValueId)
		})
	}

	private findKeyWord(kId: number, kValueId: number) {
		const keyword = config.keywords.find(k => k.kId === kId && k.kValueId === kValueId)
		if (!keyword) {
			console.error(`Card '${this.name} (${this.element})': Can't find keyword ${kId} ${kValueId}`)
			return `${kId}_${kValueId}`
		}
		return keyword.keyword
	}

	private writeText(ctx: canvas.CanvasRenderingContext2D, text: string, x: number, initY: number, maxWidth: number, lineHeight: number) {
		// https://stackoverflow.com/a/16599668/12121518
		const words = text.split(" ");
		const lines = [];
		let currentLine = words[0];

		for (var i = 1; i <= words.length; i++) {
			var word = words[i];
			var width = ctx.measureText(currentLine + " " + word).width;
			if (width < maxWidth) {
				currentLine += " " + word;
			} else {
				lines.push(currentLine);
				currentLine = word;
			}
		}
		lines.push(currentLine)
		lines.forEach((line, i) => {
			const measure = ctx.measureText(line)
			const y = initY + ((measure.actualBoundingBoxAscent + measure.actualBoundingBoxDescent) + lineHeight) * i
			console.log(`'${line}'`, x, y, i, measure.actualBoundingBoxAscent, measure.actualBoundingBoxDescent)
			ctx.fillText(line, x, y)
		})
	}

	public async exportImage() {
		const image_width = 295
		const image_height = 412
		const c = canvas.createCanvas(image_width, image_height)
		const ctx = c.getContext("2d")

		// Background
		await canvas.loadImage(config.cardBackground(this.element))
			.then(img => ctx.drawImage(img, 0, 0, image_width, image_height))
		// Illustration
		await canvas.loadImage(config.sprite(this.illustration))
			.then(img => {
				const targetWith = image_height - 58
				const targetHeight = 190
				const ratio = targetHeight / targetWith
				return ctx.drawImage(img, 0, 0, img.width, img.width * ratio, 8, 56, targetWith, targetHeight)
			})
		// Title
		ctx.font = '20px Georgia'
		ctx.textAlign = 'center'
		ctx.fillText(this.name, image_width / 2 + 20, 35)
		// Costs
		let i = 0
		ctx.font = '20px Georgia'
		ctx.textAlign = 'left'
		for (let cost of this.costs) {
			const x = 10 + i * 25
			await canvas.loadImage(config.banner)
				.then(img => ctx.drawImage(img, x, 0, 23, 80))
			if (cost.type === 'resource') {
				await canvas.loadImage(config.cost(cost.element))
					.then(img => ctx.drawImage(img, x + 4, 25, 15, 15))
				ctx.fillText(cost.quantity.toString(), x + 7, 55)
			} else if (cost.type === 'keyword') {
				const text = `${cost.keyword} X${cost.quantity}`
				ctx.save()
				ctx.font = '12px Georgia'
				ctx.translate(x + 14, 75)
				ctx.rotate(-90 * Math.PI / 180)
				ctx.fillText(text, 0, 0, 70)
				ctx.restore()
			} else {
				console.error(`${this.name}: Unexpected cost type: ${cost}`)
			}
			i++
		}
		// Text
		ctx.font = '10px Georgia'
		this.writeText(ctx, this.text, 16, 300, image_width - 16, 0)
		await fs.writeFile(config.exportCard(this.illustration), c.toBuffer(), {flag: 'w'})
		console.log(`exported ${config.exportCard(this.illustration)}`)
	}
}