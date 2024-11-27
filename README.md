<div align="center">
  <br />
    <a href="https://.vercel.app" target="_blank">
      <img src="./pages/images/HomeDark.png" alt="Project Banner">
    </a>
  <br />
  <div>
    <img src="https://img.shields.io/badge/-Next_JS-black?style=for-the-badge&logoColor=white&logo=nextdotjs&color=000000" alt="nextdotjs" />
    <img src="https://img.shields.io/badge/-Shadcn-green?style=for-the-badge&logoColor=white&logo=shadcn&color=gray" alt="shadcn" />
    <img src="https://img.shields.io/badge/-ReactJs-61DAFB?logo=react&logoColor=white&style=for-the-badge" alt="reactdotjs" />
    <img src="https://img.shields.io/badge/-Tailwind_CSS-black?style=for-the-badge&logoColor=white&logo=tailwindcss&color=06B6D4" alt="tailwindcss" />
    <img src="https://img.shields.io/badge/-JavaScript-purple?style=for-the-badge&logoColor=white&logo=javascript&color=yellow" alt="javascript" />
    <img src="https://img.shields.io/badge/-ApexCharts-orange?style=for-the-badge&logoColor=white&logo=apexcharts&color=orange" alt="apexcharts" />
  </div>
  <h3 align="center"> Short.en <br /> Link Shortener + QR Code Generator </h3>

   <div align="center">
     Visually stunning link shortener for your personal use. Powerful admin dashboard with tons of features and enhanced performance. Ease of use and scalable.
    </div>
</div>

## 🍁 Overview

A Link Shortener + QR Code Generator for personal use or use within a small team. Fast, reliable and with a visually appealing UI. Scales and supports tons of extra features like scheduled live links, expiration dates and more easily integrable. Features an admin dashboard with everything you need.

### 💻 Technolgoies

[![React JS](https://skillicons.dev/icons?i=react "React JS")](https://react.dev/ "React JS") [![Next JS](https://skillicons.dev/icons?i=next "Next JS")](https://nextjs.org/ "Next JS") ![Javascript](https://skillicons.dev/icons?i=js "Javascript") [![Mongo](https://skillicons.dev/icons?i=mongodb "Mongo")](https://www.typescriptlang.org/ "Typescript") [![Tailwind CSS](https://skillicons.dev/icons?i=tailwind "Tailwind CSS")](https://tailwindcss.com/ "Tailwind CSS") [![Vercel](https://skillicons.dev/icons?i=vercel "Vercel")](https://vercel.app/ "Vercel")

- **Language**: Javascript
- **Backend**: [Next.js 15](https://nextjs.org/) + [MongoDB](https://www.mongodb.com/) with Mongoose
- **Frontend**: [Next.js 15](https://nextjs.org/) + UI Components via [`shadcn/ui`](https://ui.shadcn.com/) + Tailwind
- **Others**: [Apexcharts](https://apexcharts.com/), [QRCode.React](https://www.npmjs.com/package/qrcode.react), NanoId, IP-API, React Icons, Axios

## 🚀 Features

- 🔗 **Shorten any link** and generate a corresponding **QR code** (with custom image). You can also assign a **custom alias** if needed.
- 📋 **Quickly copy** the shortened URL or **export the QR code** as a `PNG` file.
- 🌙 **Toggle between light mode and dark mode** for a personalized viewing experience.
- 🖥️ **Admin dashboard** that provides all the necessary operations to manage links, filter links, view detailed information for each, and export all data as a **CSV**.
- 🎨 **Beautiful UI elements** designed using **Tailwind CSS** and `ChadCN`, along with icons from **Lucide**.
- 📈 **Insightful graphs** powered by **ApexCharts**, showing detailed analytics such as the number of times a shortened URL has been used, as well as recent accesses via timestamps, device, browser and country.
- 📅 **Scheduling feature** for setting link live after a certain day and **Expiration Date** which automatically deletes the link from the database using **TTL**.
- 🏗️ **Scalable** architecture to easily add new features as needed.
- 🔒 ** Restrictive** access, because who would want someone to come and abuse the service


## 🤝 Usage 

1. IN home page simply put in link and fill extra fields if need be and you're good to go
2. Then in admin dashboard you can perform various operations which you can see in the screenshots below
3. For the authorization part just simply go to Mongo and manually insert a document with field `q` and value of the secret code in the same collection as the URLs.

## ⚙️ Setup

```shell
git clone https://github.com/Eshan05/LeanURL
cd LeanURL
npm i
# Look at .env.example
npm run dev
```

## 📱 Screenshots

<div align="center">

![HomeQR](pages/images/HomeDark_QR.png)
![SearchHome](pages/images/SearchHome.png)
![Analytics](pages/images/Analytics.png)
![AnalyticsDark_Search](pages/images/AnalyticsDark_Search.png)
![MobileAnalytics_Delete](pages/images/MobileAnalytics_Delete.png)
![MobileHome](pages/images/MobileHome.png)
![AnalyticsDark_Edit](pages/images/AnalyticsDark_Edit.png)
![AnalyticsDark_Graph](pages/images/AnalyticsDark_Graph.png)
![AnalyticsDark_Recent](pages/images/AnalyticsDark_Recent.png)
![AnalyticsDark_Toast](pages/images/AnalyticsDark_Toast.png)
![AnalyticsDark_QR](pages/images/AnalyticsDark_QR.png)

</div>

## 📄 Additional Notes

- See LICENSE (GPLv3)
- Feel free to raise issues if you notice anything wrong
- [Hero section](https://shadcn-ui-blocks.vercel.app/blocks/hero-sections) 