let changeUrl = ()=>{
  let pageName = window.location.pathname.replace('/','');
  if (pageName == "settings.html") {
    let active = document.getElementsByClassName('footerNav-li active')[0].id
    active.className = 'footerNav-li';
    document.getElementById(pageName +'-li').className = 'footerNav-li active';
  }
}