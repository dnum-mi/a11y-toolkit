(function () {
	'use strict';

	/* Le rendu clair/sombre du DSFR ne dépend que de l'attribut data-fr-theme
	   (pas data-fr-scheme) : c'est normalement le composant JS "Scheme" de DSFR
	   qui le calcule, mais son démarrage passe par requestAnimationFrame et peut
	   ne jamais se déclencher à temps (onglet en arrière-plan, etc.). On pilote
	   donc data-fr-theme nous-mêmes pour ne pas en dépendre.
	   DSFR clone aussi le bouton .js-theme-btn dans le menu mobile
	   (.fr-header__menu-links) après le chargement : on délègue au document
	   pour couvrir les deux copies. */

	function prefersDark() {
		return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
	}

	function applyTheme(isDark) {
		document.documentElement.setAttribute('data-fr-scheme', isDark ? 'dark' : 'system');
		document.documentElement.setAttribute('data-fr-theme', isDark ? 'dark' : 'light');
		document.documentElement.style.colorScheme = isDark ? 'dark' : '';
	}

	function updateThemeButtons(isDark) {
		document.querySelectorAll('.js-theme-btn').forEach(function (b) {
			b.classList.toggle('fr-icon-moon-line', !isDark);
			b.classList.toggle('fr-icon-sun-line', isDark);
			b.textContent = isDark ? 'Mode clair' : 'Mode sombre';
			b.setAttribute('aria-label', isDark ? 'Activer le mode clair' : 'Activer le mode sombre');
		});
	}

	var initialIsDark = prefersDark();
	applyTheme(initialIsDark);
	updateThemeButtons(initialIsDark);

	/* DSFR clone ce bouton dans le menu mobile après le chargement, avec le
	   contenu du bouton tel qu'il était AVANT ce script (icône lune par
	   défaut) : on resynchronise une fois le clonage terminé. */
	window.addEventListener('load', function () {
		updateThemeButtons(document.documentElement.getAttribute('data-fr-theme') === 'dark');
	});

	document.addEventListener('click', function (event) {
		var btn = event.target.closest('.js-theme-btn');
		if (!btn) return;
		var isDark = document.documentElement.getAttribute('data-fr-theme') !== 'dark';
		applyTheme(isDark);
		updateThemeButtons(isDark);
	});
})();
