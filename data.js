/* ===== Edit site content here ===== */
const COMPANY = {
  name: "B.I.P Diversity PTY LTD", email: "info@bipdiversity.co.za", tel: "+27 11 000 0000",
  devices: 500, vat: 0.15, shipFlat: 99, freeShipOver: 2000
};

/* Payment settings. Leave blank = demo mode (no real payment is taken). */
const PAYMENTS = {
  payfast: { merchantId: "", merchantKey: "", sandbox: true },   // fill in from your PayFast account
  googlePay: { merchantId: "", gatewayMerchantId: "" }          // fill in from Google Pay & Wallet Console
};

const TOPICS = [
  {file:"local-core.html", label:"Local Core"},
  {file:"secure-ict.html", label:"Secure ICT"},
  {file:"smart-integration.html", label:"Smart Integration"},
  {file:"security.html", label:"Security"},
  {file:"energy-saving.html", label:"Energy Saving"}
];

const PRODUCTS = [
  {id:"starter", name:"Genesis Starter Kit", cat:"Kits", desc:"Gateway hub + 3 sensors. Everything to start.", price:1499, img:"starter-kit"},
  {id:"pro", name:"Pro Data Centre Kit", cat:"Kits", desc:"50 sensors + edge server for rack monitoring.", price:24999, img:"pro-kit"},
  {id:"hub", name:"Genesis Gateway Hub", cat:"Control", desc:"Local core hub with Zigbee, Z-Wave and Matter.", price:1199, img:"gateway-hub"},
  {id:"panel", name:"Touch Control Panel 10\"", cat:"Control", desc:"Wall-mounted touch interface for the whole home.", price:3499, img:"touch-panel"},
  {id:"sensors", name:"Smart Sensor 3-Pack", cat:"Sensors", desc:"Temperature, motion and door sensors.", price:649, img:"sensor-3pack"},
  {id:"thermostat", name:"Smart Thermostat", cat:"Sensors", desc:"Local climate control with scheduling.", price:1099, img:"thermostat"},
  {id:"camera", name:"Smart Security Camera", cat:"Security", desc:"Indoor/outdoor camera with local recording.", price:1299, img:"smart-camera"},
  {id:"lock", name:"Smart Door Lock", cat:"Security", desc:"Keypad and app access, works offline.", price:2299, img:"smart-lock"},
  {id:"plug", name:"Smart Energy Plug", cat:"Energy", desc:"Switch appliances and track their power use.", price:279, img:"smart-plug"},
  {id:"lights", name:"Smart Light Bulbs (4)", cat:"Energy", desc:"Dimmable, tunable white bulbs.", price:899, img:"smart-lights"},
  {id:"power", name:"Genesis Power Pack", cat:"Energy", desc:"Battery backup to keep the hub and router on during load shedding.", price:5999, img:"power-pack"},
  {id:"saas", name:"SaaS License (monthly)", cat:"Software", desc:"Unlimited racks with local AI. Billed monthly.", price:499, img:"saas-license", digital:true}
];

/* Placeholder installers: swap `ext`/versions for your real builds. */
const OS_LIST = [
  {id:"mac", label:"macOS", req:"macOS 12 or later (Apple Silicon and Intel)", versions:[
    {v:"2.4.1", date:"2026-10-20", size:"84 MB", ext:"dmg", note:"Latest stable"},
    {v:"2.4.0", date:"2026-09-30", size:"83 MB", ext:"pkg", note:"Enterprise installer"},
    {v:"2.3.2", date:"2026-08-12", size:"80 MB", ext:"dmg", note:"Previous release"},
    {v:"2.2.0", date:"2026-05-04", size:"77 MB", ext:"dmg", note:"Legacy (macOS 11)"}]},
  {id:"windows", label:"Windows", req:"Windows 10 or 11 (64-bit)", versions:[
    {v:"2.4.1", date:"2026-10-20", size:"92 MB", ext:"exe", note:"Latest stable"},
    {v:"2.4.1", date:"2026-10-20", size:"95 MB", ext:"msi", note:"MSI for IT deployment"},
    {v:"2.3.2", date:"2026-08-12", size:"89 MB", ext:"exe", note:"Previous release"},
    {v:"2.2.0", date:"2026-05-04", size:"85 MB", ext:"exe", note:"Legacy"}]},
  {id:"linux", label:"Linux", req:"Ubuntu 22.04+, Debian 12+, Fedora 38+ (x86_64 / arm64)", versions:[
    {v:"2.4.1", date:"2026-10-20", size:"71 MB", ext:"deb", note:"Debian / Ubuntu"},
    {v:"2.4.1", date:"2026-10-20", size:"72 MB", ext:"rpm", note:"Fedora / RHEL"},
    {v:"2.4.1", date:"2026-10-20", size:"98 MB", ext:"AppImage", note:"Any distribution"},
    {v:"2.3.2", date:"2026-08-12", size:"69 MB", ext:"tar.gz", note:"Previous release"}]},
  {id:"android", label:"Android", req:"Android 9 or later", versions:[
    {v:"3.1.0", date:"2026-10-18", size:"48 MB", ext:"apk", note:"Latest stable"},
    {v:"3.0.2", date:"2026-09-02", size:"47 MB", ext:"apk", note:"Previous release"},
    {v:"2.9.5", date:"2026-06-21", size:"44 MB", ext:"apk", note:"Android 8 compatible"}]},
  {id:"ios", label:"iOS", req:"iOS 15 or later (iPhone and iPad)", versions:[
    {v:"3.1.0", date:"2026-10-18", size:"61 MB", ext:"ipa", note:"Latest (TestFlight build)"},
    {v:"3.0.2", date:"2026-09-02", size:"60 MB", ext:"ipa", note:"Previous release"},
    {v:"2.9.5", date:"2026-06-21", size:"57 MB", ext:"ipa", note:"iOS 14 compatible"}]},
  {id:"huawei", label:"Huawei", req:"HarmonyOS 3+ or EMUI 10+ (no Google services needed)", versions:[
    {v:"3.1.0", date:"2026-10-19", size:"52 MB", ext:"apk", note:"AppGallery build"},
    {v:"3.0.2", date:"2026-09-03", size:"51 MB", ext:"apk", note:"Previous release"},
    {v:"2.9.5", date:"2026-06-22", size:"49 MB", ext:"apk", note:"EMUI 10 compatible"}]}
];

/* Tech headlines, paraphrased. Dates are when reported. Update these regularly. */
const ARTICLES = [
  {date:"2026-10-26", when:"Week of Oct 26", tag:"Hardware", title:"Apple reportedly lines up touch-screen OLED MacBook Pros for an Oct. 28 launch event", src:"SiliconReport", url:"https://www.siliconreport.com/topic/hardware"},
  {date:"2026-10-15", tag:"Smart Home", title:"Apple's new approach to the smart home gets the weekly-podcast treatment", src:"TWiT Tech News Weekly", url:"https://twit.tv/episodes/news?page=13"},
  {date:"2026-10-08", tag:"Privacy", title:"US lawmakers take aim at Flock's surveillance cameras", src:"TWiT Tech News Weekly", url:"https://twit.tv/episodes/news?page=3"},
  {date:"2026-10-01", tag:"Software", title:"Windows 11 version 26H2 is now available", src:"TWiT Tech News Weekly", url:"https://twit.tv/episodes/news?page=13"},
  {date:"2026-10-02", when:"Oct 2026", tag:"Gadgets", title:"Amazon refreshes its whole Kindle family, including an aluminium model", src:"T3", url:"https://www.t3.com/au/news/archive/2026/10"},
  {date:"2026-10-19", when:"Week of Oct 19", tag:"Wearables", title:"Bee's Frontier AI wearable launches at $74.99", src:"SiliconReport", url:"https://www.siliconreport.com/topic/hardware"}
];

/* Pages about each topic */
const TOPIC_PAGES = {
  "local-core.html": {title:"Local Core", lead:"The brain of Genesis lives in your building, not in someone else's data centre.",
    body:["The Genesis Local Core is a small on-premises server that runs your automations, schedules, scenes and device communication. Because decisions are made locally, lights, locks and sensors respond instantly and keep working when the internet drops or the power flickers.",
          "During load shedding the Core can be paired with the Genesis Power Pack so the hub and your router stay online. Your rules continue to run and your data stays in the building."],
    points:["Runs offline with no cloud account required","Instant response because commands never leave your network","Automatic local backups and one-click restore","Remote access is optional and uses an encrypted tunnel","Works with the Genesis Gateway Hub and Touch Control Panel"],
    cta:{label:"Shop the Gateway Hub", href:"shop.html"}},
  "secure-ict.html": {title:"Secure ICT", lead:"Security is designed into the network, not added afterwards.",
    body:["Genesis separates smart devices from your personal computers using their own network segment, so a compromised gadget cannot reach your files. Traffic between devices and the Core is encrypted end to end.",
          "We do not harvest usage data. Logs stay on your server and you decide what is kept, shared or deleted. The same ICT backbone supports WiFi 6, structured cabling and fibre-ready installations."],
    points:["Encrypted device-to-core communication","Separate network for IoT devices","No advertising or analytics data sold or shared","Role-based access for family members and staff","Regular signed software updates"],
    cta:{label:"Download the software", href:"downloads.html"}},
  "smart-integration.html": {title:"Smart Integration", lead:"One control surface for every protocol and brand you already own.",
    body:["Genesis speaks Zigbee, Z-Wave and Matter, so lighting, sensors, locks and appliances from different manufacturers can sit in one system. You can build scenes such as 'Movie night' or 'Away' that coordinate everything at once.",
          "Control it from the wall-mounted touch panel, the mobile apps (Android, iOS and Huawei) or the desktop apps for Windows, macOS and Linux."],
    points:["Zigbee, Z-Wave and Matter supported","Scenes, schedules and conditional rules","Touch panel, mobile and desktop control","Open data export for your own dashboards","Add new devices without rewiring"],
    cta:{label:"Browse compatible devices", href:"shop.html"}},
  "security.html": {title:"Security", lead:"Protect your home or business with systems that keep watching even when the internet is down.",
    body:["Genesis integrates CCTV cameras, door sensors, smart locks, biometric access and intrusion detection. Recording and alerts are handled by the Local Core, so footage is stored on your own hardware.",
          "Rules can combine devices: if a door opens while the system is armed, lights switch on, cameras start recording and you are notified."],
    points:["Local video recording, no subscription needed","Smart locks with keypad and app access","Door, window and motion sensors","Instant alerts to phones and the touch panel","Activity history for audits"],
    cta:{label:"Shop security devices", href:"shop.html"}},
  "energy-saving.html": {title:"Energy Saving", lead:"See where your power goes and cut waste automatically.",
    body:["Smart plugs and meters show usage per appliance. Genesis can shift heavy loads away from peak times, switch off standby devices and respond to load-shedding schedules automatically.",
          "If you have solar or battery storage, the system can prioritise essential circuits and report how much power you generate and use."],
    points:["Per-appliance power monitoring","Automatic load shedding responses","Solar and battery integration","Heating and cooling schedules","Monthly usage reports"],
    cta:{label:"Shop energy products", href:"shop.html"}}
};
