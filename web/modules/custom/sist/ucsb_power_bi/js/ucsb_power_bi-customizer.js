function ucsb_power_bi_customizeReportEmbed(sel, width = 0, height = 0, title = '', name = '') {
    // Override iframe sizing on report rendered in div. Other iframe properties may be customized here.
    window.addEventListener("DOMContentLoaded", function(e) {
      var iframes = document.querySelectorAll(`#${sel}` + " iframe");
      for (var i = 0; i < iframes.length; i++) {
        iframes[i].frameBorder = 0;
        iframes[i].attributes.removeNamedItem("style");
        iframes[i].title = (title.length > 0) ? title : 'UCSB Power BI';
        iframes[i].name = (name.length > 0) ? name : ((title.length > 0) ? title : 'UCSB Power BI');
        iw = (width <= 0) ? (window.innerWidth * (17/24)) : width;
        ih = (height <= 0) ? (iw * (19/32)) : height;
        iframes[i].width = iw + "px";
        iframes[i].height = ih + "px";
      }
    });
  }