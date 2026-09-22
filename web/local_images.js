(function () {
  const localImages = {
    ulcer: { src: 'assets/cases/ulcer_visible_vessel.jpg' },
    varix: { src: 'assets/cases/esophageal_varices.jpg' },
    uc: { src: 'assets/cases/ulcerative_colitis.jpg' },
    crohn: { src: 'assets/cases/crohn_colitis.jpg' },
    egc: { src: 'assets/cases/early_gastric_cancer.jpg' },
    barrett: { src: 'assets/cases/barrett_esophagus.jpg' },
    candida: { src: 'assets/cases/esophageal_candidiasis.jpg' },
    gave: { src: 'assets/cases/gave_before_after.png' },
    gist: { src: 'assets/cases/gist.jpg' },
    phg: {
      src: 'assets/cases/portal_hypertensive_gastropathy.jpg',
      source: 'https://commons.wikimedia.org/wiki/File:PHGastro.jpg',
      credit: 'Samir · GFDL / CC BY-SA 3.0 · Wikimedia Commons'
    },
    ercpStone: { src: 'assets/cases/ercp_stone.jpg' },
    poemPhoto: { src: 'assets/cases/poem_procedure_2013.jpg' },
    gastricAntrum: { src: 'assets/cases/gastric_ulcer_antrum.jpg' }
  };

  Object.entries(localImages).forEach(([key, replacement]) => {
    if (window.GI_IMAGES && window.GI_IMAGES[key]) {
      Object.assign(window.GI_IMAGES[key], replacement);
    }
  });

  (window.GI_CASES || []).forEach((caseData) => {
    if (caseData.imageMeta && localImages[caseData.image]) {
      Object.assign(caseData.imageMeta, localImages[caseData.image]);
    }
  });
})();
