export default {
	"TextFolder": "./assets/TextAsset",
	"banner": './assets/Costs/banner.png',
	"heart": './assets/CardBackgrounds/heart_empty.png',
	"cost": (element: string) => `./assets/Costs/${element}.png`,
	"sprite": (cardName: string) => `./assets/Sprite/${cardName}.png`,
	"cardBackground": (type: string) => `./assets/CardBackgrounds/card_background_${type}_for_game.png`,
	"exportCard": (name: string) => `./export/${name}.png`,
	"resourcesIds": {
		2: "air",
		3: "fire",
		4: "water",
		5: "vegetal",
		6: "mineral",
		7: "arcane"
	},
	"cardTypes": {
		0: 'permanent',
		1: ''
	},
	"keywords": [
		{ kId: 0, kValueId: 1, keyword: 'protecteur' },
		{ kId: 0, kValueId: 2, keyword: 'imbloquable' },
		{ kId: 0, kValueId: 3, keyword: 'unique' },
		{ kId: 1, kValueId: 0, keyword: 'graine' },
		{ kId: 1, kValueId: 1, keyword: 'arbre' },
		{ kId: 1, kValueId: 2, keyword: 'flamme' },
		{ kId: 1, kValueId: 3, keyword: 'armure d\'écorce' },
		{ kId: 1, kValueId: 4, keyword: 'druide (équipement)' },
		{ kId: 1, kValueId: 5, keyword: 'souffle' },
		{ kId: 1, kValueId: 6, keyword: 'vent' },
		{ kId: 1, kValueId: 7, keyword: 'vague' },
		{ kId: 1, kValueId: 8, keyword: 'goutte' },
		{ kId: 1, kValueId: 9, keyword: 'condensation' },
		{ kId: 1, kValueId: 10, keyword: 'océan' },
		{ kId: 1, kValueId: 14, keyword: 'armure' },
		{ kId: 2, kValueId: 0, keyword: 'corps' },
		{ kId: 2, kValueId: 1, keyword: 'tête' },
		{ kId: 2, kValueId: 4, keyword: 'arme' },
		{ kId: 2, kValueId: 7, keyword: 'anneau' },
	]
}