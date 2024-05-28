const state={allVehicles:[],currentPage:1,selectedTypes:[],selectedSeats:"all",sortPriceOrder:"asc",sortSpeedOrder:"asc"};let config={};const loadConfig=async()=>{try{let e=await fetch("./configs/flugzeugeConfig.json");config=await e.json(),state.itemsPerPage=config.itemsPerPage}catch(t){console.error("Failed to load config:",t)}},showLoader=()=>{document.getElementById("loader").style.display="block"},hideLoader=()=>{document.getElementById("loader").style.display="none"},fetchVehicles=async()=>{if(showLoader(),config.useGoogleSheets)try{let e=await fetch(config.GoogleSheetsURL),t=await e.text(),a=csvToJson(t);state.allVehicles=a,hideLoader()}catch(r){console.error("Error fetching or converting CSV:",r)}else try{let s=await fetch(config.localJsonPath),i=await s.json();state.allVehicles=i,hideLoader()}catch(l){console.error("Error fetching local JSON:",l),hideLoader()}},csvToJson=e=>{let t=e.split("\n").filter(e=>e.trim()),a=t[0].split(",").map(e=>e.trim());return t.slice(1).map(e=>{let t=[],r,s=/(?:^|,)(?:"([^"]*)"|([^",]*))/g;for(;null!==(r=s.exec(e));){let i=void 0!==r[1]?r[1]:r[2];t.push(i.trim())}let l={};return a.forEach((e,a)=>{l[e]=void 0!==t[a]?t[a]:""}),l})},filterVehicles=()=>{let{allVehicles:e,selectedTypes:t,selectedSeats:a}=state;return e.filter(e=>{let r=["name","brand","type"].some(t=>e[t].toLowerCase().includes(document.getElementById("searchInput").value.toLowerCase())),s=0===t.length||t.includes(e.type),i="all"===a||("5"===a?parseInt(e.seats,10)>=5:e.seats.toString()===a);return r&&s&&i})},updateDisplay=()=>{let e=document.getElementById("vehicle_card_container");e.innerHTML="";let t=filterVehicles();if(t.length>0){let a=t.map(e=>generateVehicleCardHTML(e)).join("");e.innerHTML=a}else e.innerHTML='<div class="text-center p-4">No vehicles match your criteria.</div>';let r=document.getElementById("resetFilters");state.selectedTypes.length>0||"all"!==state.selectedSeats?r.style.display="block":r.style.display="none",updatePagination(),AOS.refresh()},sortVehiclesByPrice=e=>{state.allVehicles.sort((t,a)=>{let r=parseFloat(t.price.replace(/[^0-9.-]+/g,"")),s=parseFloat(a.price.replace(/[^0-9.-]+/g,""));return"asc"===e?r-s:s-r}),updateDisplay()},toggleSortByPrice=()=>{state.sortPriceOrder="asc"===state.sortPriceOrder?"desc":"asc";let e=document.getElementById("priceSortIcon");"asc"===state.sortPriceOrder?(e.classList.remove("ti-sort-descending"),e.classList.add("ti-sort-ascending")):(e.classList.remove("ti-sort-ascending"),e.classList.add("ti-sort-descending")),sortVehiclesByPrice(state.sortPriceOrder)},sortVehiclesBySpeed=e=>{state.allVehicles.sort((t,a)=>{let r=parseInt(t.speed,10),s=parseInt(a.speed,10);return"asc"===e?r-s:s-r}),updateDisplay()},toggleSortBySpeed=()=>{state.sortSpeedOrder="asc"===state.sortSpeedOrder?"desc":"asc",sortVehiclesBySpeed(state.sortSpeedOrder)},attachSpeedSortEventListeners=()=>{document.querySelectorAll(".sortbySpeed").forEach(e=>{e.addEventListener("change",function(e){let t=e.target.value;sortVehiclesBySpeed(t)})})},generateVehicleCardHTML=e=>`
<div data-aos="fade-up" data-aos-duration="500" data-aos-anchor-placement="bottom" data-type="${e.type}" data-price="${e.price}" data-class="${e.class}" id="vehicle_card_${e.id}"
  class="group flex flex-col h-full bg-white border border-gray-200 shadow-lg rounded-lg bg-white/70 dark:bg-black/70 dark:border-gray-700">
  <div class="flex justify-center relative rounded-t-lg overflow-hidden h-52">
    <div class="transition-transform duration-500 transform ease-in-out hover:scale-110 w-full">
      <div class="absolute inset-0 bg-black">
        <img id="vehicle_image_${e.id}" src="${e.image}" />
      </div>
    </div>
    <span id="vehicle_price_${e.id}"
      class="absolute top-0 left-0 inline-flex mt-3 ml-3 px-3 py-2 rounded-lg z-10 bg-accent text-sm font-medium text-accent-content select-none">
      ${e.price}
    </span>
  </div>
  <div class="p-4 md:p-6 text-center bg-[#171B22]">
    <span id="vehicle_brand_${e.id}" class="cursor-pointer block mb-1 text-xs font-semibold uppercase text-primary dark:text-primary">
      ${e.brand}
    </span>
    <h3 id="vehicle_name_${e.id}" class="cursor-pointer font-semibold text-gray-300 dark:hover:text-white text-2xl">
      ${e.name}
    </h3>
  </div>
  <div
    class="cursor-pointer mt-auto flex border-t border-gray-700 divide-x divide-gray-700 dark:border-gray-700 dark:divide-gray-700">
    <div id="vehicle_speed_${e.id}"
      class="bg-[#22262D] w-full py-3 px-4 inline-flex justify-center items-center gap-2 rounded-bl-lg font-medium  text-gray-700 shadow-sm align-middle focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white focus:ring-blue-600 transition-all text-sm sm:p-4 dark:border-gray-700 dark:text-gray-400 dark:hover:text-white dark:focus:ring-offset-gray-800">
      <i class="ti ti-brand-speedtest"></i>
      ${e.speed} MPH
    </div>
    <div id="vehicle_seat_${e.id}"
      class="bg-[#22262D] w-full py-3 px-4 inline-flex justify-center items-center gap-2 font-medium text-gray-700 shadow-sm align-middle focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white focus:ring-blue-600 transition-all text-sm sm:p-4 dark:border-gray-700 dark:text-gray-400 dark:hover:text-white dark:focus:ring-offset-gray-800">
      <i class="ti ti-bounce-right"></i>
      ${e.seats} Seats
    </div>
    <div id="vehicle_type_${e.id}"
      class="bg-[#22262D] w-full py-3 px-4 inline-flex justify-center items-center gap-2 rounded-br-lg font-medium text-gray-700 shadow-sm align-middle focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white focus:ring-blue-600 transition-all text-sm sm:p-4 dark:border-gray-700 dark:text-gray-400 dark:hover:text-white dark:focus:ring-offset-gray-800">
      <i class="ti ti-bleach"></i>
      ${e.type}
    </div>
  </div>
</div>
`,updatePagination=()=>{let{currentPage:e,itemsPerPage:t,allVehicles:a}=state,r=(e-1)*t,s=r+t,i=filterVehicles().slice(r,s),l=document.getElementById("vehicle_card_container");l.innerHTML=i.map(e=>generateVehicleCardHTML(e)).join(""),window.scrollTo({top:0,behavior:"smooth"}),AOS.init({once:!1})},attachPaginationEventListeners=()=>{document.getElementById("nextPage").addEventListener("click",()=>{state.currentPage++,updatePagination()}),document.getElementById("prevPage").addEventListener("click",()=>{state.currentPage>1&&(state.currentPage--,updatePagination())})},attachEventListeners=()=>{document.getElementById("searchInput").addEventListener("input",updateDisplay),document.querySelectorAll(".vehicleType").forEach(e=>{e.addEventListener("change",function(e){e.target.checked?state.selectedTypes.push(e.target.value):state.selectedTypes.splice(state.selectedTypes.indexOf(e.target.value),1),updateDisplay()})}),document.querySelectorAll(".seatCount").forEach(e=>{e.addEventListener("change",function(e){state.selectedSeats=e.target.value,updateDisplay()})}),document.querySelectorAll(".sortbyPrice").forEach(e=>{e.addEventListener("change",function(e){sortVehiclesByPrice(e.target.value),updateDisplay()})}),document.getElementById("toggleSortPrice").addEventListener("click",toggleSortByPrice),document.getElementById("toggleSortSpeed").addEventListener("click",toggleSortBySpeed);let e=document.getElementById("resetFilters");e.addEventListener("click",resetFilters)},resetFilters=()=>{state.selectedTypes=[],state.selectedSeats="all",document.querySelectorAll(".vehicleType").forEach(e=>{e.checked=!1}),document.querySelectorAll(".seatCount").forEach(e=>{e.checked="all"===e.value}),updateDisplay(),document.getElementById("resetFilters").style.display="none"},initialize=async()=>{await loadConfig(),await fetchVehicles(),attachEventListeners(),attachPaginationEventListeners(),updatePagination()};initialize();