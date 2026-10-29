const PAGE=120;
const $=s=>document.querySelector(s);
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const fmt=n=>Number(n).toLocaleString('zh-CN');
const S={cat:'',q:'',n:PAGE};
const CATS=META.cats;

/* 数据里保留日文分类值；界面显示中文 */
const CAT_LABEL={
  '春':'春','夏':'夏','秋':'秋','冬':'冬',
  'ランジェリー':'内衣','パーティ':'派对','水着':'泳装','セクシー':'性感'
};
const catLabel=c=>CAT_LABEL[c]||c;

function drawTabs(){
  const t=[['','全部',D.length],...CATS.map(c=>[c,catLabel(c),META.counts[c]])];
  $('#tabs').innerHTML=t.map(([v,l,n])=>`<button class="tab" role="tab" data-v="${esc(v)}" aria-selected="${S.cat===v}">${esc(l)}<em>${fmt(n)}张</em></button>`).join('');
}
$('#tabs').onclick=e=>{const b=e.target.closest('.tab');if(!b)return;S.cat=b.dataset.v;S.n=PAGE;drawTabs();draw();scrollTo({top:Math.min(scrollY,$('.tools').offsetTop)})};
let qt;$('#q').oninput=e=>{clearTimeout(qt);qt=setTimeout(()=>{S.q=e.target.value.trim().toLowerCase();S.n=PAGE;draw()},150)};

const JA={"黒":"black","ブラック":"black","黑":"black","白":"white","ホワイト":"white","赤":"red","レッド":"red","红":"red","ピンク":"pink","粉":"pink","青":"blue","ブルー":"blue","蓝":"blue","紺":"navy","ネイビー":"navy","茶":"brown","ブラウン":"brown","ベージュ":"beige","アイボリー":"ivory","グレー":"grey","灰":"grey","緑":"green","グリーン":"green","绿":"green","黄":"yellow","イエロー":"yellow","オレンジ":"orange","橙":"orange","紫":"purple","パープル":"purple","ラベンダー":"lavender","ミント":"mint","クリーム":"cream","金":"gold","ゴールド":"gold","银":"silver","銀":"silver","シルバー":"silver","カーキ":"khaki","ボルドー":"burgundy","オリーブ":"olive","ドレス":"dress","ワンピース":"dress","連衣裙":"dress","连衣裙":"dress","スカート":"skirt","裙":"skirt","ジャケット":"jacket","コート":"coat","外套":"coat","セーター":"sweater","カーディガン":"cardigan","ブラウス":"blouse","シャツ":"shirt","パンツ":"pants","ジーンズ":"jeans","牛仔裤":"jeans","ショートパンツ":"shorts","ブーツ":"boots","スニーカー":"sneakers","サンダル":"sandals","ヒール":"heels","ローファー":"loafers","パンプス":"pumps","靴下":"socks","ソックス":"socks","タイツ":"tights","ストッキング":"stockings","バッグ":"bag","トート":"tote","帽子":"hat","ハット":"hat","ベレー帽":"beret","ニット帽":"beanie","スカーフ":"scarf","マフラー":"muffler","手袋":"gloves","ベルト":"belt","ネックレス":"necklace","チョーカー":"choker","キャミソール":"camisole","ブラ":"bra","ショーツ":"briefs","水着":"swimsuit","泳装":"swimsuit","ビキニ":"bikini","パーカー":"hoodie","ベスト":"vest","コルセット":"corset","ローブ":"robe","タートルネック":"turtleneck","サングラス":"sunglasses","カチューシャ":"headband","エプロン":"apron","デニム":"denim","レース":"lace","サテン":"satin","レザー":"leather","革":"leather","ニット":"knit","スエード":"suede","ファー":"fur","ベルベット":"velvet","ウール":"wool","シフォン":"chiffon","チュール":"tulle","メッシュ":"mesh","コーデュロイ":"corduroy","花柄":"floral","水玉":"polka-dot","ドット":"polka-dot","リボン":"ribbon","フリル":"frill","プリーツ":"pleated","ミニ":"mini","ミディ":"midi","マキシ":"maxi","内衣":"lingerie","ランジェリー":"lingerie","派对":"party","パーティ":"party","性感":"sexy","セクシー":"sexy","春":"spring","夏":"summer","秋":"autumn","冬":"winter"};
function hit(d){
  if(S.cat&&d.カテゴリ!==S.cat)return false;
  if(!S.q)return true;
  const id=d.id.toLowerCase(),tk=d.キーワード.split(' ');
  const catZh=catLabel(d.カテゴリ);
  return S.q.split(/\s+/).every(w=>{
    const e=JA[w]||w;
    return id.includes(w)||d.カテゴリ.includes(w)||catZh.includes(w)||
      (e!==w&&(id.includes(e)||tk.some(t=>t.startsWith(e))))||
      tk.some(t=>t.startsWith(e)||t.includes(w));
  });
}
let VIEW=[];
function card(d,i){return `<article class="card" tabindex="0" data-i="${i}"><div class="ph"><img loading="lazy" decoding="async" src="${esc(d.サムネ)}" alt="${esc(d.id)}"></div>
  <div class="meta"><div class="row"><div class="id">${esc(d.id)}</div><div class="cat">${esc(catLabel(d.カテゴリ))}</div></div><div class="desc">${esc(d.キーワード.split(' ').join(' · '))}</div></div></article>`}
function draw(){
  VIEW=D.filter(hit);const g=$('#grid');
  $('#count').textContent=`显示 ${fmt(VIEW.length)} 张`;
  g.innerHTML=VIEW.slice(0,S.n).map(card).join('');
  if(!VIEW.length)g.innerHTML=`<div class="empty" style="grid-column:1/-1"><b>没有符合条件的图片</b>请调整分类或搜索关键词。</div>`;
  const m=$('#more');m.hidden=VIEW.length<=S.n;m.textContent=`加载更多（剩余 ${fmt(Math.max(0,VIEW.length-S.n))} 张）`;
}
function addMore(){if(S.n>=VIEW.length)return;const from=S.n;S.n+=PAGE;$('#grid').insertAdjacentHTML('beforeend',VIEW.slice(from,S.n).map((d,k)=>card(d,from+k)).join(''));
  const m=$('#more');m.hidden=VIEW.length<=S.n;m.textContent=`加载更多（剩余 ${fmt(Math.max(0,VIEW.length-S.n))} 张）`}
$('#more').onclick=addMore;
if('IntersectionObserver' in window){new IntersectionObserver(es=>{if(es.some(e=>e.isIntersecting))addMore()},{rootMargin:'800px'}).observe($('#more'))}
$('#grid').addEventListener('click',e=>{const c=e.target.closest('.card');if(c)openM(+c.dataset.i)});
$('#grid').addEventListener('keydown',e=>{if(e.key==='Enter'){const c=e.target.closest('.card');if(c)openM(+c.dataset.i)}});

let MI=0;
function openM(i){MI=i;$('#modal').classList.add('open');document.body.style.overflow='hidden';showM()}
function closeM(){$('#modal').classList.remove('open');document.body.style.overflow='';const c=document.querySelector(`.card[data-i="${MI}"]`);c&&c.focus()}
function showM(){const d=VIEW[MI],img=$('#mimg');img.src=d.サムネ;const full=new Image();full.onload=()=>{if(VIEW[MI]===d)img.src=d.画像};full.src=d.画像;img.alt=d.id;
  $('#mtitle').textContent=d.id;$('#mcat').textContent=catLabel(d.カテゴリ);
  const kv=$('#mkv');
  if(kv) kv.innerHTML=`<dt>分类</dt><dd>${esc(catLabel(d.カテゴリ))}</dd><dt>关键词</dt><dd>${esc(d.キーワード)}</dd>`;
  const dl=$('#mdl');dl.href=d.原寸;dl.setAttribute('download',d.id+'.png')}
function step(n){const j=MI+n;if(j<0||j>=VIEW.length)return;MI=j;if(j>=S.n)addMore();showM()}
$('#mprev').onclick=()=>step(-1);$('#mnext').onclick=()=>step(1);$('#mclose').onclick=closeM;
$('#modal').onclick=e=>{if(e.target.id==='modal')closeM()};
document.addEventListener('keydown',e=>{if(!$('#modal').classList.contains('open'))return;
  if(e.key==='Escape')closeM();else if(e.key==='ArrowRight')step(1);else if(e.key==='ArrowLeft')step(-1)});
let tx=null;$('#mimg').addEventListener('touchstart',e=>{tx=e.touches[0].clientX},{passive:true});
$('#mimg').addEventListener('touchend',e=>{if(tx===null)return;const dx=e.changedTouches[0].clientX-tx;if(Math.abs(dx)>40)step(dx<0?1:-1);tx=null});
drawTabs();draw();
(()=>{const nav=document.getElementById('infotabs');if(!nav)return;
  const tabs=[...nav.querySelectorAll('.itab')];let cur=null;
  const close=(back)=>{if(!cur)return;const t=cur;t.setAttribute('aria-expanded','false');document.getElementById(t.getAttribute('aria-controls')).hidden=true;cur=null;if(back)t.focus()};
  const open=t=>{if(cur===t){close(true);return}close(false);cur=t;t.setAttribute('aria-expanded','true');const p=document.getElementById(t.getAttribute('aria-controls'));p.hidden=false;
    if(innerWidth<=560){const r=t.getBoundingClientRect();p.style.top=(r.bottom+8)+'px'}else p.style.top='';p.focus({preventScroll:true})};
  tabs.forEach((t,i)=>{t.addEventListener('click',()=>open(t));t.addEventListener('keydown',e=>{
    if(e.key==='ArrowRight'||e.key==='ArrowLeft'){e.preventDefault();const n=tabs[(i+(e.key==='ArrowRight'?1:tabs.length-1))%tabs.length];n.focus();if(cur)open(n)}})});
  nav.querySelectorAll('.ipclose').forEach(b=>b.addEventListener('click',()=>close(true)));
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&cur){e.stopPropagation();close(true)}},true);
  let swallow=false;
  document.addEventListener('pointerdown',e=>{if(cur&&!nav.contains(e.target)){close(false);swallow=true;setTimeout(()=>swallow=false,600)}},true);
  document.addEventListener('click',e=>{if(swallow){swallow=false;e.preventDefault();e.stopPropagation()}},true);
  addEventListener('scroll',()=>{if(cur&&innerWidth<=560)close(false)},{passive:true});
  addEventListener('resize',()=>close(false));
})();
