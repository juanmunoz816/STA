// llamar funciones precargadas 
$(document).ready(function () {
    getTop()
});

let dataTop 
let selectorListDonor = $('#list-ul-donor') 
let btnSearch = $('#btn-busquedadonante')
let search = $('#busquedadonante')
let searchData
let ulResultSearch = $('#ul-result-search')
let sectionResult = $('.result-search')
let month = $('.li-moth')
let year = $('#year-select')
let excelData 
let name_csv
// traer el top 10 de los donantes
async function getTop() {
    const dates = getDate();
    
    const rawData = await fetch('https://corsanywherepopbumps.herokuapp.com/https://amazongear-dot-saving-the-amazon-155216.ue.r.appspot.com/index.php/donor/?access=$1$IVPdhs1n$0uv9Se71A9giLfnL/AceV/&fromDate='+dates.startMonth+'&toDate='+dates.endMonth+'&groupby=document_number&orderby=total_donated&order=DESC&limit=10&total_donated=true', {
        method: 'GET'
    })
    dataTop = await rawData.json()
    mapTop()
}

function mapTop() {
    let li  = ''
    if (dataTop.error != null) {
        li = '<li class="lista"> No tenemos donantes este mes</li>'
    }else{
        $.each(dataTop, function (i, item) {
            li = li + '<li class="lista"> '+item.document_number + ' - ' + item.firstname.concat(' ', item.lastname) +'</li>'
        });
    }
       
   
    selectorListDonor.html(li)
}

function getDate() {
    var date = new Date();
    var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);

    startMonth = firstDay.getFullYear() + "-" + ("0" + (firstDay.getMonth() + 1)).slice(-2) + "-" + ("0" + firstDay.getDate()).slice(-2)
    endMonth = lastDay.getFullYear() + "-" + ("0" + (lastDay.getMonth() + 1)).slice(-2) + "-" + ("0" + lastDay.getDate()).slice(-2)

    return {startMonth : startMonth, endMonth: endMonth }
}

btnSearch.click(async (e) => { 
    e.preventDefault()
    btnSearch.html('Buscando...')
    btnSearch.attr('disabled', true)
    
    sectionResult.hide()
    searchParam = search.val();
    if (searchParam == null || searchParam == "") {
        alertify.error('el parametro no puede ser vacio');
        btnSearch.html('Conoce más')
        btnSearch.attr('disabled', false)
        return;
    }
    try {
        const rawData = await fetch(`https://corsanywherepopbumps.herokuapp.com/https://amazongear-dot-saving-the-amazon-155216.ue.r.appspot.com/index.php/donor/?access=$1$IVPdhs1n$0uv9Se71A9giLfnL/AceV/&search=`+searchParam, {
            method: 'GET',
        });
        searchData = await rawData.json()
        mapSearch()
    } catch (error) {
        alertify.error('ha ocurrido un error en la busqueda' + error)
    }

    
})


async  function mapSearch() {
    let li =''
    if (searchData.error == null) {
        $.each(searchData, function (i, item) {
            li = li + '<li class="desplegables"> '+item.document_number + ' - ' + item.firstname.concat(' ', item.lastname) +'</li>'
        });
    }else{
        li = '<li class="desplegables"> ' + searchData.error + '</li>'
    }

    ulResultSearch.html(li)
    sectionResult.show(1000)
    btnSearch.text('Conoce más')
    btnSearch.prop('disabled', false)

}

month.click(async (e) => {
    let month_value = e.target.getAttribute("data-month")
    
    if (year.val() == "") {
        alertify.error('Seleccione un año')
        return
    }
    alertify.success('Buscando datos...')
    let url = `https://storage.googleapis.com/saving-the-amazon-155216.appspot.com/pdf_donantes_bdb/Dnt_${month_value}_${year.val()}.pdf`

    try {
        const rawData = await fetch(`https://corsanywherepopbumps.herokuapp.com/${url}`, {
        method: 'GET',
        });
        status = await rawData.status
        if (status == 200) {
            window.open(url, '_blank');
        }else{
            alertify.error('No se encontraron donates 🙁')
        }
    } catch (error) {
        alertify.error('ha ocurrido un error en la busqueda' + error)
    }
})




