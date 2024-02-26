/**minicalendar
 * @file
 * Overrride UI behaviors
 */

// this is not working... yet
document.addEventListener('DOMContentLoaded', (event) => {
  // the function would run when the page is fully loaded
  function updateNoEventsMessage() {
    // select the element that contains the "No events found" text
    var noEventsElement = document.querySelector('.lw_event_item_title'); 

    // check if the element exists and contains the specific text
    if (noEventsElement && noEventsElement.textContent.includes("No events found")) {
      // update the text content
      noEventsElement.textContent = "No events found. Please click another date or click the \"This Month's Events\" or \"Past Events\" buttons.";
    }
  }
  updateNoEventsMessage();
});

(function ($) {
  
  let tags = [
    'datascience',
    'dataliteracy',
    'researchdata'
  ]

    $(document).ready(function() {

      const localistMinicalendarEvents = document.querySelector('.localist_minicalendar_events');

      if (localistMinicalendarEvents) {
        const h2Element = document.createElement('h2');
        h2Element.textContent = "Upcoming Events";
        h2Element.id = 'event-selection-label';
        localistMinicalendarEvents.insertAdjacentElement('beforebegin', h2Element);
      }

      const minicalendarNav = document.querySelector('.localist_minicalendar_nav');

      if (minicalendarNav) {
        const anchorTags = minicalendarNav.getElementsByTagName('a');
        if (anchorTags.length >= 2) {
          anchorTags[0].textContent = "This Month's Events";
          anchorTags[1].textContent = "Past Events";
        }
      }

      const elements = document.querySelectorAll('[onclick]');

      // Loop through each element
      elements.forEach(element => {
        const originalOnClick = element.getAttribute('onclick');
        // Check if the onclick event starts with "minicalendar_xxxx"
        if (originalOnClick.startsWith('minicalendar_')) {
          // Replace the onclick event with "minicalendar()"
          funcsCalled = originalOnClick.split('.');
          newFunc = 'minicalendar';
          for(let i = 1; i < funcsCalled.length; i++){
            newFunc += '.' + funcsCalled[i];
          }
          element.setAttribute('onclick', newFunc);
          // console.log(`Changed onclick event from "${originalOnClick}" to ${newFunc}`);
        }
      });

      minicalendar = (function () {
        var minical_id;
        var all_months =[];
        var all_month_names =[];
        var position = 0;
        var events_base_url; 
        var current_day;
        var base_types = [];
        var current_type = base_types.join(',');
        var limit_filters = false;
        var days_shown = 31;

        function hasClass(el, klass) {
          if (!el) return;
          var classes = el.className;
          return (classes.length > 0 && (classes == klass ||
            new RegExp("(^|\\s)" + klass + "(\\s|$)").test(classes)));
        }

        function addClass(el, klass) {
          if (!el) return;
          if (!hasClass(el, klass)) el.className = el.className + " " + klass;
        }

        function removeClass(el, klass) {
          if (!el) return;
          el.className = el.className.replace(
            new RegExp("(^|\\s+)" + klass + "(\\s+|$)"), ' ');
        }

        function swapClass(el, oldklass, newklass) {
          removeClass(el, oldklass);
          addClass(el, newklass);
        }

        function hideElement(el) {
          if (!el) return;
          if (el.style.display != 'none') {
            el.oldDisplay = el.style.display;
            el.style.display = 'none';
          }
        }

        function showElement(el) {
          if (!el) return;
          if (el.style.display == 'none') {
            el.style.display = el.oldDisplay || '';
            el.oldDisplay = undefined;
          }
        }

        function getEl(id) {
          return document.getElementById(id);
        }

        function indexInArray(ary, obj) {
          var num = ary.length, idx;
          for (idx = 0; idx < num; idx++) {
            if (ary[idx] === obj) return idx;
          }
          return -1;
        }

        function findChildWithData(el, tag_name, name, value) {
          if (!el) return;

          var attr_name = "data-" + name;
          var elements = el.getElementsByTagName(tag_name);

          for (var i = 0; i < elements.length; i++) {
            var cel = elements[i];
            var av = cel.getAttribute(attr_name);
            if (av == value) return cel;
          }

          return null;
        }

        function chooseMonth(month, position) {
          var i = 0,
            m,
            num = all_months.length;
      
          var header_el = getEl(`localist-minical-${minical_id}-month-name`),
            prev_el = getEl(`localist-minical-${minical_id}-prev-month`),
            next_el = getEl(`localist-minical-${minical_id}-next-month`);

          if (header_el) {
            header_el.innerHTML = all_month_names[position];
          }

          if (prev_el) {
            if (position <= 0) {
              addClass(prev_el, 'disabled');
            } else {
              removeClass(prev_el, 'disabled');
            }
          }

          if (next_el) {
            if (position >= num - 1) {
              addClass(next_el, 'disabled');
            } else {
              removeClass(next_el, 'disabled');
            }
          }

          for (i = 0; i < num, m = all_months[i]; i++) {
            var show = (m == month);
            var div_id = `localist-minical-${minical_id}-month-` + m;
            
            var cal_el = getEl(div_id);

            if (cal_el) {
              if (show){
                showElement(cal_el); 
             } 
              else hideElement(cal_el);
            }
          }
        }

        function choseDate(el, num_days) {
          num_days = num_days || 1;

          const eventSelectLabel = document.querySelector('#event-selection-label');
          if (eventSelectLabel) {
            eventSelectLabel.textContent = num_days > 1 ? "Events" : "This Day's Events";
          }

          /* if we're not in the current displayed month, find a better one to show if possible */
          var the_date = el.getAttribute('data-date');
          var the_month = the_date.substr(5, 2);
          if (the_month.substr(0, 1) == '0') the_month = the_month.substr(1, 1);
          days_shown = num_days;

          var table;
          if (table = getEl(`localist-minical-${minical_id}-month-` + the_month)) {
            var new_el;
            if (new_el = findChildWithData(table, 'A', 'date', the_date)) {
              position = indexInArray(all_months, Number(the_month));
              chooseMonth(the_month, position);
              el = new_el;
            }
          }

          /* move highlight */
          if (current_day) swapClass(current_day.parentNode, 'localist_minicalendar_today', current_day.parentNode.oldclass);
          el.parentNode.oldclass = el.parentNode.className;
          if (num_days <= 8) swapClass(el.parentNode, 'localist_minicalendar_dimday', 'localist_minicalendar_today');
          current_day = el;

          var events_el = getEl(`localist-minical-${minical_id}-events`);
          events_el.innerHTML = "Loading...";

          /* load widget here via JSONP and update the container */
          var extra = '&start=' + el.getAttribute('data-date') + '&days=' + num_days;
          if (current_type != '') {
            extra += '&types=' + current_type;
          } else if (limit_filters) {
            extra += '&types=' + base_types.join(',');
          }

          loadScript(events_base_url + extra);
        }

        function chooseTodayReplace(num_days){
          num_days = num_days || 8;
          /* find the element representing today */
          var today = new Date();
          var month = today.getMonth() + 1,
            date = today.getDate(),
            year = today.getFullYear();
          var today_date = year + "-" + (month < 10 ? "0" : '') + month + '-' + (date < 10 ? '0' : '') + date;
          var el = findChildWithData(getEl(`localist-minical-${minical_id}`), 'a', 'date', today_date);
          choseDate(el, num_days);
        }

        // Overwriting "choseToday" to actually be chooseThisMonth
        function chooseToday(num_days) {
          chooseThisMonth();
        }

        // comment out the whole section cuz wanna remove the weekly view.

        // // Overwrite chooseThisWeek to actually be choose Past Events
        function chooseThisWeek() {
          choosePastEvents();
        }

        function chooseThisMonth() {
          var today = new Date();
          var yearList = all_month_names[position].split(' ');
          var year = today.getFullYear();
          if(yearList.length > 1){
             year = parseInt(yearList[1]);
          } 


          var month = all_months[position];
          var date = year + "-" + (month < 10 ? "0" : '') + month + '-' + (1 < 10 ? '0' : '') + 1;
          var el = findChildWithData(getEl(`localist-minical-${minical_id}`), 'a', 'date', date);
          choseDate(el, 31);
          const eventSelectLabel = document.querySelector('#event-selection-label');
          if (eventSelectLabel) {
            eventSelectLabel.textContent = "This Month's Events";
          }
        }

        function choosePastEvents() {
          chooseTodayReplace(-365);
          const eventSelectLabel = document.querySelector('#event-selection-label');
          if (eventSelectLabel) {
            eventSelectLabel.textContent = "Past Events (last 365 days)";
          }
        }
        
        
        

        function choseType(el) {
          var chosen_type = el.options[el.selectedIndex].value;
          current_type = chosen_type;
          if (base_types.length > 0) current_type += "," + base_types.join(',');
          current_type = current_type.replace(/^,/, '');
          choseDate(current_day);
        }

        function updateEvents(data) {
          var el_id = 7133;
          /* update container here */
          var events_el = getEl(`localist-minical-${minical_id}-events`);
          events_el.innerHTML = data.replace(/\$\$ID\$\$/g, el_id);
        }

        function loadScript(url) {
          var el = document.createElement('script');
          el.type = 'text/javascript';
          el.src = url;
          document.body.appendChild(el);
        }

        function setInitial() {
          const rootMiniCal = document.querySelector('.localist_minicalendar');
          if (rootMiniCal) {
            minical_id = rootMiniCal.id.substring(17);
            // console.log(minical_id);
          }

          var tagsString = ""
          if(tags.length > 0){
            tagsString = "tags=" + tags[0];
          }
          
          for (let i = 1; i < tags.length; i++){
            tagsString += "%2C" + tags[i];
          }

          const h1StartMonth = document.querySelector(`#localist-minical-${minical_id}-month-name`).textContent;
          all_months = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
          all_month_names = [
          'January',
          'February',
          'March',
          'April',
          'May',
          'June',
          'July',
          'August',
          'September',
          'October',
          'November',
          'December'];
          
          var today = new Date();
          var year = today.getFullYear() + 1;
          const monthIndex = all_month_names.indexOf(h1StartMonth);
          let monthsBefore = all_month_names.slice(0, monthIndex);
          monthsBefore = monthsBefore.map(item => item + ` ${year}`);
          const monthsBeforeId = all_months.slice(0, monthIndex);
          const monthsAfterId = all_months.slice(monthIndex);
          const monthsAfter = all_month_names.slice(monthIndex);

  
          all_month_names = monthsAfter.concat(monthsBefore);
          all_months = monthsAfterId.concat(monthsBeforeId);

          events_base_url = `https://campuscalendar.ucsb.edu/widget/view.html?all_instances=1\u0026callback=minicalendar_${minical_id}.updateEvents\u0026match=any\u0026noevents=1\u0026num=50\u0026schools=ucsb\u0026show_types=0\u0026show_view_all_cta=0\u0026${tagsString}\u0026target_blank=1\u0026template=card`;

          var initial_date_el = getEl(`localist-minical-${minical_id}-initial`);

          
          current_day = initial_date_el;
        }

        /* set up initial state */
        setTimeout(setInitial, 1);

        return {
          chooseMonth: chooseMonth,
          nextMonth: function () {
            position++;
            if (position >= all_months.length) position = all_months.length - 1;
            chooseMonth(all_months[position], position);
          },
          previousMonth: function () {
            position--;
            if (position < 0) position = 0;
            chooseMonth(all_months[position], position);
          },
          chooseTodayReplace: chooseTodayReplace,
          choseDate: choseDate,
          updateEvents: updateEvents,
          chooseToday: chooseToday,
          chooseThisWeek: chooseThisWeek,
          chooseThisMonth: chooseThisMonth,
          choosePastEvents: choosePastEvents,
          choseType: choseType,
          setInitial: setInitial
        }; /* return */
      })();
      ; minicalendar.setInitial();
    });

})(jQuery);

