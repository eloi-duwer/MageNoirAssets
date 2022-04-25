export type Card = {
	id: number
	cardTypeId: number
	name: string
	costs: Cost[]
	properties: Property[]
	keywords: Keyword[]
	stats?: Stat[]
}

export type Cost = ResourceCost | KeywordCost

export type ResourceCost = {
	statId: number
	baseValue: number
	$type: "CCGKit.PayResourceCost"
}

export type KeywordCost = Keyword & {
	baseValue: number,
	$type: "MageNoir.ComponentCost"
}

export type Keyword = {
	keywordId: number,
	keywordValueId: number,
}

export type Property = {
	value?: string
	name: string
	$type?: string
}

export type Stat = LifeStat

export type LifeStat = {
	name: "Life"
	baseValue: number
	originalValue: number
	statId: 0
	modifiers: any[]
}

export type Element =
	| "air"
	| "fire"
	| "water"
	| "arcane"
	| "mineral"
	| "vegetal"
	| "unknown"

export type CardType =
	| "Permanent"
	| ""
	| "Équipement"
	| "Rituel"
	| "unknown"