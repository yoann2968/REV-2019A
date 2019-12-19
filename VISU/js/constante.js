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
	} else if (poster.name === 'poster_carteRouteRome') {
		description = "la Table de Peutinger\nreprésentant les routes\net les principales villes\nde l’Empire romain"
	} else if (poster.name === 'poster_VillaMysteres') {
		description = "La maitresse de maison\nest plusieurs fois représentée,\npoursuivie par des ménades,\nen présence de Dionysos\net dans une phase\nd’initiation occulte"
	} else if (poster.name === 'poster_Anubis') {
		description = "Maître des nécropoles\net protecteur des\nembaumeurs, Anubis\nest un dieu\nde l\'Egypte Antique"
	} else if (poster.name === 'poster_Hieroglyphes') {
		description = "Les hiéroglyphes\nsont un système d'écriture\nutilisés autrefois\nen Egypte,\nles caractères sont\nreprésentés par des\nobjets divers"
	} else if (poster.name === 'poster_AbouSimbel') {
		description = "Le temple d\'Abou Simbel\na été construit\ndans la roche\nlors de la XIXème\ndynastie Egyptienne"
	} else if (poster.name === 'poster_Nil') {
		description = "Plus grand fleuve\ndu monde, le Nil\ntraverse l\'Egypte\nsur 6700km"
	} else if (poster.name === 'poster_Sphinx') {
		description = "Le Sphinx est la\nplus grande sculpture\ndu monde en\natteignant les\n73,5 mètres de long"
	} else if (poster.name === 'poster_Pyramides') {
		description = "Autrefois utilisées\ncomme tombeau des rois,\nles pyramides sont\naujourd'hui un symbole\nde l\'Egypte"
	} else if (poster.name === 'poster_Sarcophage') {
		description = "Lorsque qu'un\npharaon venait\nà mourir,\nson corps était\nmis dans\nun sarcophage"
	} else if (poster.name === 'poster_PetitMinou') {
		description = "Le phare du Petit Minou\nindique aux bateaux désirant\nse rendre à Brest, la route\n à suivre pour entrer dans\nla rade"
	} else if (poster.name === 'poster_IleDeMolene') {
		description = "L'île de Molène,\nau large des\ncôtes Bretonnes"
	} else if (poster.name === 'poster_IleDesCapucins') {
		description = "Construit en 1848\net situé à l'entrée\n du goulet de Brest,\n l'île des capucins\n a longtemps défendu\n la ville de Brest"
	} else if (poster.name === 'poster_GwennHaDu') {
		description = "Le Gween Ha Du est\nle drapeau de la Bretagne,\n il est composé\nd'hermines et de bandes\nblanches et noires"
	} else if (poster.name === 'poster_Meneham') {
		description = "Le corps de garde\nde Meneham a été\nconstruit vers 1756\npour surveiller la côte"
	}

	return description;
}