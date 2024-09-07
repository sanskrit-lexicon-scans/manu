// (setq js-indent-level 1)  # for Emacs
// var urlglob;  // global for debugging

function get_verse_html(adhyaya,page) {
 // let nnn = page.padStart(3,'0');
 // let pdfcur = `pg_${nnn}.pdf`;
 let pdfcur = `${page}.pdf`
 let urlcur = `pdfpages/${pdfcur}`;
 let android = ` <a href='${urlcur}' style='position:relative; left:100px;'>Click to load pdf</a>`;
 let imageElt = `<object id='servepdf' type='application/pdf' data='${urlcur}' 
              style='width: 98%; height:98%'> ${android} </object>`;
 // return imageElt;
 let style = `font-size: smaller; font-weight:bold;`;
 let adhyayaElt = `<p style="${style}">adhyāya,śloka = ${adhyaya}</p>`;
 let pagenavElt = get_pagenav_html(page);
 let ans = adhyayaElt + imageElt + pagenavElt;
 if (false) { // dbg
  console.log('get_verse_html:',ans);
 }
 return ans;
}

function display_verse_html(adhyaya,page) {
 //verse_id(indexes);
 let html = get_verse_html(adhyaya,page);
 let elt=document.getElementById('verse');
 elt.innerHTML = html;
}

function get_unknown_html(as) {
 let style = `font-size: smaller; font-weight:bold; color:red;`;
 let elt = `<p style="${style}">Unknown adhyāya,śloka: ${as}</p>`;
 return elt;
}
function display_unknown_html(adhyaya) {
 let html = get_unknown_html(adhyaya)
 let elt=document.getElementById('verse');
 elt.innerHTML = html;
}
function display_verse_url(so) {
 let as = so['adhyaya'] + ',' + so['shloka'];
 let page = so['apage'];
 
 if (page === undefined) {
  display_unknown_html(as);
 } else {
  display_verse_html(as,page)
 }
}

function get_pagenav_html(page) {
 // page is a string
 let ipage = parseInt(page);
 let ipagenext = ipage + 1;
 let ipageprev = ipage - 1;
 let href = window.location.href;
 let urlobj = new URL(href);
 // print('urlobj=',urlobj
 let search = urlobj.search;
 let urlbase = href.replace(search,''); // remove search part of url
 let html = `<div id="pagenav">
<a href="${urlbase}?page=${ipageprev}" class="nppage"><span class="nppage1">&lt;</span>&nbsp;</a>
<a href="${urlbase}?page=${ipagenext}" class="nppage"><span class="nppage1">&gt;</span>&nbsp;</a>
</div>`;
 return html;
}
function get_page_html(so) {
 let page = so['page'];
 let pdfcur = `${page}.pdf`
 let urlcur = `pdfpages/${pdfcur}`;
 let android = ` <a href='${urlcur}' style='position:relative; left:100px;'>Click to load pdf</a>`;
 let imageElt = `<object id='servepdf' type='application/pdf' data='${urlcur}' 
              style='width: 98%; height:98%'> ${android} </object>`;
 // return imageElt;
 let style = `font-size: smaller; font-weight:bold;`;
 let pageElt = `<p style="${style}">page = ${page}</p>`;
 let pagenavElt = get_pagenav_html(page);
 let ans = pageElt + imageElt + pagenavElt;
 if (false) { // dbg
  console.log('get_page_html:',ans);
 }
 return ans;
}
function display_page_url(so) {
 //console.log('display_page_url:',so);
 let html = get_page_html(so);
 let elt=document.getElementById('verse');
 elt.innerHTML = html;
}

function get_unknown_search_url(so) {
 let search = so.search;
 let style = `font-size: smaller; font-weight:bold; color:red;`;
 let elt = `<p style="${style}">1. search by adhyāya,śloka: '?3,5'
  <br/>2. search by page: '?page=25':</p>`;
 return elt;
}

function display_unknown_search_url(so) {
 let html = get_unknown_search_url(so);
 let elt=document.getElementById('verse');
 elt.innerHTML = html;
}
function parse_search(search) {
 /* two possibilities
  ?A,S  (adhyAya, shloka)
  ?page=N  (external) page number
 */
 let regex = /[?](\d+),(\d+)/;   // adhyaya,shloka
 let match = search.match(regex);
 // adhyaya, shloka, page --- all should be integer sequences
 // default values undefined
 let a,s,p,apage;
 let searchtype = 'unknown'; // or shloka, page
 if (match) {
  a = match[1];
  s = match[2];
  searchtype='shloka';
  as = a + ',' + s;
  apage = manudata[as]; // manudata is global
 } else {
  regex = /[?]page=(\d+)/;
  match = search.match(regex);
  if (match) {
   let praw = match[1]; // a digit sequence
   let p0 = parseInt(praw);
   if ( (p0 < 1) || (p0 > 621)) {
    p = '8'; // title page default
   } else {
    p = p0.toString();
   }
   // make p a 0-padded
   p = p.padStart(3,'0');
   searchtype='page';
  }
 }
 const result = {
  search:search,
  searchtype:searchtype,
  adhyaya:a,
  shloka:s,
  page:p,
  apage:apage
 };
 return result;
}
function parse_url() {
 let href = window.location.href;
 let url = new URL(href);
 urlglob = url;
 let search = url.search  // ?A,S  A = adhyaya number, S = Shloka number
 let searchobj = parse_search(search);
 if (false) { //debug
  console.log('parse_url: search=',search);
  console.log('searchobj=',searchobj);
 }
 if (searchobj['searchtype'] == 'shloka') {
  display_verse_url(searchobj);
 } else if (searchobj['searchtype'] == 'page') {
  display_page_url(searchobj);
 } else {
  display_unknown_search_url(searchobj);
 }
}
document.getElementsByTagName("BODY")[0].onload = parse_url; //display_verse_url;
