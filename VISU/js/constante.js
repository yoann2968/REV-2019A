/* Récupère la description de l'oeuvre voulue
   Attention : maximum 7 lignes sinon texte plus grand que l'oeuvre */
function getTexte(poster) {
	var description;
	if (poster.name === 'poster_poster01') {
		description = 'Marie Curie \ndécouvrant \nla célèbre épice qui \nportera son nom'
	} else if (poster.name === 'poster_DaCortana1643') {
		description = 'Da Cortona 1643\nRemus et Romulus\nrecueillis par Faustulis'
	} else if (poster.name === 'poster_monuPompeiMuraillePoissons') {
		description = "Peinture des murs\nd'une villa de Pompéi\nMuraille dite des Poissons\n(musée de Naples)"
	} else if (poster.name === 'poster_eruptionVesuve') {
		description = "Pierre Henri\nEruption du Vésuve\n arrivée le 24 août\n de l'an 79 de J.-C\n sous le règne de Titus"
	} else if (poster.name === 'poster_geromePolliceVerso') {
		description = "Pollice Verso\ndu peintre français\nJean-Léon Gérôme\nréalisé en 1872"
	}


	return description;
}