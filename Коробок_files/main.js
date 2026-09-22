$(document).ready(function(){
    $("#menu,#menu,#menu").on("click","a", function (event) {
        
        event.preventDefault();

        var id  = $(this).attr('href'),

        top = $(id).offset().top;

        $('body,html').animate({scrollTop: top}, 800);
    });
    /*--------------------
     MAGNIFIC POPUP JS
     ----------------------*/
    $('.video-popup').magnificPopup({
        type: 'iframe',
        removalDelay: 500, //delay removal by X to allow out-animation
        callbacks: {
            beforeOpen: function () {
                // just a hack that adds mfp-anim class to markup
                this.st.image.markup = this.st.image.markup.replace('mfp-figure', 'mfp-figure mfp-with-anim');
                this.st.mainClass = this.st.el.attr('data-effect');
            }
        },
        iframe: {
            markup: '<div class="mfp-iframe-scaler">' +
                '<div class="mfp-close"></div>' +
                '<iframe class="mfp-iframe" frameborder="0" allow="autoplay"></iframe>' +
                '<div class="mfp-title">Some caption</div>' +
                '</div>'
        },
        gallery: {
            enabled: true
        },
        closeOnContentClick: true,
        midClick: true
    });
});

$(function(){
        $('.burger').click(function(){
            $('.menu').toggleClass('menu-open');
        });
    });
    $(function(){
        $('.burger').click(function(){
            $('body').toggleClass('body-open');
        });
    });
    $(function(){
        $('.burger').click(function(){
            $('.burger').toggleClass('burger-open');
        });
    });
    $(function(){
        $('.js-close').click(function(){
            $('.menu').toggleClass('menu-open'); 
        });
    });
    $(function(){
        $('.js-close').click(function(){
            $('.burger').toggleClass('burger-open'); 
        });
    });
    /*
    $(function(){
        $('.mob-menu').click(function(){
            $('.menu_el').toggleClass('menu_el-open'); 
        });
    });
    $(".close__menu").click(function(e){
      e.preventDefault();
      $(".menu_el").removeClass("menu_el-open");
    });*/
	$(function(){
        $('.filter__mob').click(function(){
            $('.filter-container').toggleClass('filter-container-open'); 
        });
    });
	$(function(){
        $('.filter__mob').click(function(){
            $('#panel').toggleClass('panel-open'); 
        });
    });
	$(function(){
        $('.filter__mob').click(function(){
            $('body').toggleClass('body-open'); 
        });
    });
	$(function(){
		$("#panel").click(function(e){
		  e.preventDefault();
		  $("body").removeClass("body-open");
		});
	});
	$(function(){
		$("#panel").click(function(e){
		  e.preventDefault();
		  $("#panel").removeClass("panel-open");
		});
	});
	$(function(){
		$("#panel").click(function(e){
		  e.preventDefault();
		  $(".filter-container").removeClass("filter-container-open");
		});
	});
	$(function(){
		$(".filter-btn").click(function(e){
		  e.preventDefault();
		  $(".filter-container").removeClass("filter-container-open");
		});
	});
	$(function(){
		$(".filter-btn").click(function(e){
		  e.preventDefault();
		  $("body").removeClass("body-open");
		});
	});
	$(function(){
		$(".filter-btn").click(function(e){
		  e.preventDefault();
		  $("#panel").removeClass("panel-open");
		});
	});
	$(function(){
        $('.serch_el').click(function(){
            $('.serch__con').toggleClass('serch__con-open'); 
        });
    });
	$(function(){
		$(".close-serch").click(function(e){
		  e.preventDefault();
		  $(".serch__con").removeClass("serch__con-open");
		});
	});



