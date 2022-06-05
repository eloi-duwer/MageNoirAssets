import fs from 'fs/promises'
import config from './config'
import path from 'path'
import Asset from './types/asset'
import Card from './Card'

;
(async () => {
	await fs.mkdir('./export').catch(_ => {/* probably EEXIST */})
	const cardsFiles = await fs.readdir(config.TextFolder)
	cardsFiles.map(async cardFile => {
		const cardAsset: Asset.Card = JSON.parse((await fs.readFile(path.join(config.TextFolder, cardFile))).toString('utf-8'))
		const card = new Card(cardAsset)
		card.exportImage()
	})
})()