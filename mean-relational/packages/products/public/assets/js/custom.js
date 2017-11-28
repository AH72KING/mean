/*$(function(){
    $(document).ready(function($) {
       	$('.vertical-ticker').totemticker({
            row_height   :    '250px',
            // next      :    '#ticker-next',
            // previous  :    '#ticker-previous',
            stop         :    '#stop',
            start        :    '#start',
            mousestop    :    true,
        });
           
    	$(document).on('mouseleave','.vertical-ticker', function(){
    	   $('#stop').trigger('click');
    	   $('#start').trigger('click');
        });
    });
});*/
// notification
function notify(text='No Message', className='error', globalPos='top center', delay=5000){ 
  $.notify(text,
  {
    // whether to hide the notification on click
    clickToHide: true,
    // whether to auto-hide the notification
    autoHide: true,
    // if autoHide, hide after milliseconds
    autoHideDelay: delay,
    // show the arrow pointing at the element
    arrowShow: true,
    // arrow size in pixels
    arrowSize: 5,
    // position defines the notification position though uses the defaults below
    position: '',
    // default positions
    elementPosition: 'bottom left',
    globalPosition: globalPos,
    // default style
    style: 'bootstrap',
    // default class (string or [string])
    className: className,
    // show animation
    showAnimation: 'slideDown',
    // show animation duration
    showDuration: 400,
    // hide animation
    hideAnimation: 'slideUp',
    // hide animation duration
    hideDuration: 200,
    // padding between element and notification
    gap: 2
  })
}

function closeNoti() {
  $('.notifyjs-wrapper').trigger('notify-hide');
}