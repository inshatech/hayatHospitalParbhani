const nav = ()=>{
  let pathName  = window.location.pathname.replace('/','');
  let pageName  = pathName.replace(".html",'');
  if (pathName == pageName+'.html') {
    document.getElementById(pageName).classList.add("active");
  }
}