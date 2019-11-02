/* Récupère la description de l'oeuvre voulue
   Attention : maximum 7 lignes sinon texte plus grand que l'oeuvre */
function getTexte(poster){
	var description;
	if (poster.name === 'poster_poster01'){
		description = 'Marie Curie \ndécouvrant \nla célèbre épice qui \nportera son nom'
	}
	return description;
}