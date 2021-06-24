const treeBtnSearch = $('#btn-busquedaarbol')
const treeCodeInput = $('#busquedaarbol')
const btnPostal = $('#btn-postal')

// Form DOM Elements
const treeFrom = $('#tu_arbol_form')
const dataColumn = $('#saving_tu_arbol .data_col')
// let treeCodeInput = $('#tu_arbol_code')

// Modifiable DOM Elements
const treeCode = $('#tree-code')
const treeCommunity = $('#tree-community')
const treeKind = $('#tree-kind')
const treeFactor = $('#tree-factor')
const treeGiver = $('#tree-giver')
const treeReceiver = $('#tree-receiver')
const treePlatingDate = $('#tree-planting_date')
const cardHeader = $('.data_card .card_header')
const treeArrows = $('#tree-arrows button')
const treeArrowLeft = $('#tree-arrows .left')
const treeArrowRight = $('#tree-arrows .right')
const treePhotoArrows = $('#photo-arrows')
const treePhotoRight = $('#photo-arrows .right')
const treePhotoLeft = $('#photo-arrows .left')
const progressWizardRow = $('#saving_tu_arbol .progress_row')
const progressWizardStep = $('.wizard-progress .step')
const followUpRow = $('#saving_tu_arbol .followUp-row')
const sentence = $('.sentence')
const last_30_start = $('#last-30-start')
const last_30_end = $('#last-30-end')
const currentMoth = $('#curren-month')
const summary = $('#summary')

// Gobla varabiles
let selectedTree = {}
let selectedTreeIndex = 0
let selectedTreeImages = []
let selectedTreeImageIndex = 0
let trees = []
let language = window.location.pathname.split('/').includes('en') ? 1 : 0

// Get tree images from the server
const getTreeImages = async (treeId) => {
  const rawData = await fetch(`https://corsanywherepopbumps.herokuapp.com/https://amazongear-dot-saving-the-amazon-155216.appspot.com/index.php/images/?access=$1$IVPdhs1n$0uv9Se71A9giLfnL/AceV/&id_product_individual=${treeId}`, {
    method: 'GET',
  });
  const data = await rawData.json()

  if (Array.isArray(data)) {
    selectedTreeImages = data.map(photo => photo.url)

    // Hide arrows if images array has less than 2 images
    if (selectedTreeImages.length <= 1) treePhotoArrows.css('display', 'none')

    cardHeader.css('background-image', `url(${selectedTreeImages[0]})`)
  }
}

// Format Date to display 
const formatDate = (date) => {
  let month = date.getUTCMonth() + 1; //months from 1-12
  let day = date.getUTCDate();
  let year = date.getUTCFullYear();

  return year + "/" + month + "/" + day;
}

// 

const handleIconsInTable = (icons = []) => {

  icons.forEach(icon => {
    let emoji = "🌱"

    if (icon.position.split("-").includes("2")) {
      emoji = "🌱"
    } else if (icon.position.split("-").includes("3")) {
      emoji = "🪴"
    } else if (icon.position.split("-").includes("4")) {
      emoji = "☀️"
    } else if (icon.position.split("-").includes("5")) {
      emoji = "🚿"
    } else if (icon.position.split("-").includes("6")) {
      emoji = "✂️"
    } else if (icon.position.split("-").includes("7")) {
      emoji = "🐞"
    } else if (icon.position.split("-").includes("8")) {
      emoji = "💩"
    } else if (icon.position.split("-").includes("9")) {
      emoji = "👀"
    }
    $(`#${icon.position}`).html(`<span class='emoji'>${emoji} <span class='quantity'>${icon.quantity == null ? '' : icon.quantity}</span>`)

  })
}

// Get tree metadata to display on tables
const getTreeMetaData = async (plantingDate) => {

  const today = new Date()
  //calculate time difference  
  let time_difference = today.getTime() - plantingDate.getTime();
  //calculate days difference by dividing total milliseconds in a day  
  let days_difference = Math.floor(time_difference / (1000 * 60 * 60 * 24));
  // Calculate number of months that have passed since planting 
  let months = Math.floor(days_difference / 30)
  if (months < 1) return

  console.log(months)

  // Initial steps for progress wizard
  let stepInProgress = months >= 6 ? 6 : months
  let stepsCompleted = months >= 6 ? 6 : months + 1

  try {
    const rawData = await fetch(`https://corsanywherepopbumps.herokuapp.com/https://amazongear-dot-saving-the-amazon-155216.appspot.com/index.php/managementPlan/?access=$1$IVPdhs1n$0uv9Se71A9giLfnL/AceV/&month=${months}`, {
      method: 'GET',
    });
    const data = await rawData.json()

    const relevantData = data.map(treeMetaData => {
      return {
        sentence: JSON.parse(treeMetaData.sentence_shopify) || null,
        summary: JSON.parse(treeMetaData.summary_shopify),
        content: JSON.parse(treeMetaData.content_shopify)
      }
    })

    progressWizardRow.css('display', 'flex')
    followUpRow.css('display', 'flex')

    console.log(progressWizardStep[stepInProgress])
    progressWizardStep[stepInProgress].classList.add('in-progress')

    for (let index = 0; index < stepsCompleted; index++) {
      progressWizardStep[index].classList.add('complete')
    }

    currentMoth.html(months)
    sentence.html(Object.values(relevantData[0].sentence[0])[language])
    summary.html(Object.values(relevantData[0].summary[0])[language])
    last_30_start.html(formatDate(new Date(plantingDate.setDate(plantingDate.getDate() + (30 * months)))))
    last_30_end.html(formatDate(new Date(plantingDate.setDate(plantingDate.getDate() + (30 * months + 1)))))
    handleIconsInTable(relevantData[0].content.icons)

  } catch (error) {
    console.log(error)
    progressWizardRow.css('display', 'none')
    followUpRow.css('display', 'none')
    return
  }
}

treeBtnSearch.click(async (e) => {
  e.preventDefault()
  searchParam = treeCodeInput.val()

  $('.wizard-progress .step.complete').removeClass('complete')
  $('.wizard-progress .step.in-progress').removeClass('in-progress')

  try {
    const rawData = await fetch(`https://corsanywherepopbumps.herokuapp.com/https://amazongear-dot-saving-the-amazon-155216.appspot.com/index.php/products/?access=$P$BmviOxEjrFcEfV5XxHSFDqI2fmglXf0&search=${searchParam}&active=y&id_product_group=367`, {
      method: 'GET',
    });
    const data = await rawData.json()
    trees = data.map(tree => {
      console.log(tree)
      return {
        id: tree.id,
        code: tree.code,
        community: tree.community,
        name_type_tree: tree.name_type_tree,
        meta_cause: tree.meta_cause,
        name_buyer: tree.name_buyer,
        name: tree.name,
        latitude: tree.latitude,
        longitude: tree.longitude,
        planting_date: tree.planting_date
      }
    })
    selectedTree = trees[selectedTreeIndex]

    if (trees.length > 1) treeArrows.css('opacity', '1')
    btnPostal.attr('href', 'https://admin.myorbe.com/wp-content/themes/amazon-admin/templates/certificados/letter_photos.php?lang=es&id_product=' +selectedTree.id)

    getTreeImages(trees[0].id)
    updateTreeCard(trees[0])
    getTreeMetaData(new Date(trees[0].planting_date))

  } catch (error) {
    console.log(error)
    alert('No se ha encontrado el árbol')
  }
})

const updateTreeCard = (tree) => {
  console.log(tree)
  if (trees.length < 1 || tree === undefined) {
    return
  }

  treeCode.html(tree.code)
  treeCommunity.html(tree.community)
  treeKind.html(tree.name_type_tree)
  treeFactor.html(tree.meta_cause)
  treeGiver.html(tree.name_buyer)
  treeReceiver.html(tree.name)
  treePlatingDate.html(formatDate(new Date(tree.planting_date)))


  initMap(5, { lat: parseInt(selectedTree.latitude), lng: parseInt(selectedTree.longitude) }, true)
  dataColumn.css({
    'max-width': '50%',
    'opacity': '1',
    'max-height': '100%'
  })
}

// Function to change the tree to next or previous 
treeArrowLeft.click(() => changeTree('previous'))
treeArrowRight.click(() => changeTree('next'))

const changeTree = (direction) => {
  const treeArrayLength = trees.length

  if (direction === 'next') {
    if (selectedTreeIndex + 1 === treeArrayLength) {
      selectedTreeIndex = 0
      updateTreeCard(trees[selectedTreeIndex])
      getTreeImages(trees[selectedTreeIndex].id)
    }
    selectedTreeIndex = selectedTreeIndex + 1
    updateTreeCard(trees[selectedTreeIndex])
    getTreeImages(trees[selectedTreeIndex].id)
  } else if (direction === 'previous') {
    console.log('left', treeArrayLength)
    if (selectedTreeIndex - 1 < 0) {
      selectedTreeIndex = trees.length - 1
      updateTreeCard(trees[selectedTreeIndex])
      getTreeImages(trees[selectedTreeIndex].id)
    }
    selectedTreeIndex = selectedTreeIndex - 1
    updateTreeCard(trees[selectedTreeIndex])
    getTreeImages(trees[selectedTreeIndex].id)
  }
}


// Function to change the tree image 

treePhotoRight.click(() => changeTreeImage('next'))
treePhotoLeft.click(() => changeTreeImage('prev'))

const changeTreeImage = (direction) => {
  const imagesArrayLength = selectedTreeImages.length
  if (direction === 'next') {
    selectedTreeImageIndex + 1 === imagesArrayLength ? selectedTreeImageIndex = 0 : selectedTreeImageIndex = selectedTreeImageIndex + 1
  } else if (direction === 'prev') {
    selectedTreeImageIndex - 1 < 0 ? selectedTreeImageIndex = imagesArrayLength - 1 : selectedTreeImageIndex = selectedTreeImageIndex - 1
  }
  cardHeader.css('background-image', `url(${selectedTreeImages[selectedTreeImageIndex]})`)
}


// Create the script tag, set the appropriate attributes
var script = document.createElement('script');
script.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyBl8wKF-3WImv4qioaNMJTA8RhSKyeuO3w&callback=initMap';
script.defer = true;
script.async = true;

// Attach your callback function to the `window` object
window.initMap = function () {
  // JS API is loaded and available
};

// Append the 'script' element to 'head'
document.head.appendChild(script);

(function (exports) {
  "use strict";

  function initMap(zoom = 3, center = { lat: 1, lng: -70 }, marker = false) {
    exports.map = new google.maps.Map(document.getElementById("map"), {
      center: center,
      zoom: zoom,
      mapTypeId: 'satellite',
      disableDefaultUI: true,
      maxZoom: 15
    });

    if (marker) {
      const marker = new google.maps.Marker({
        position: center,
        map: map,
      });
    }
  }



  exports.initMap = initMap;
})

  ((this.window = this.window || {}));