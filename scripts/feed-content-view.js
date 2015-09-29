/*global define*/

define([
    'jquery',
    'underscore',
    'backbone',
    'templates'
], function ($, _, Backbone, JST) {
    'use strict';

    var FeedContentView = Backbone.View.extend({
        template: JST['public/scripts/templates/feed-content-piece.hbs'],
        contentId: 0,
        titles: [],
        events: {
            'click .prop-icon button' : 'propContent',
            'mouseenter .feed-hover-overlay' : 'pieceIn',
            'mouseleave .feed-hover-overlay' : 'pieceOut',
            "mouseenter .prop-icon .icon-up": "showPropLoginNotification",
            "mouseleave .prop-icon .icon-up": "hidePropLoginNotification",
            "mouseenter .prop-icon .icon-down": "showPropLoginNotification",
            "mouseleave .prop-icon .icon-down": "hidePropLoginNotification"
        },

        initialize: function () {
            this.on('click', function(event) {
                event.preventDefault();
                console.log("click")
            });



            this.$audioPreview = $('#audio-preview-player');
            this.$videoPreview = $('#video-preview-player');

            Props.on('clear:all', this.onDestroy, this);

        },
        onDestroy: function(){
            try{this.$audioPreview[0].stop(); }catch(e) {}
        },
        setEmptyFeedImage: function(){
            this.$el.find(".feed-hover-overlay").addClass("no-image-placeholder");
            this.$el.find(".feed-hover-overlay").css("opacity", "1");
            this.$el.find(".feed-hover-overlay .icon-shutter").css("display", "block");
        },
        render: function () {
            // Remove tags greater than 10
            this.model.attributes.tags = this.model.attributes.tags.slice(0, 10);

            this.$el.html(this.template(this.model.toJSON()));

            // Treatment for Feeds without Images
            var feedImg = this.model.attributes.feed_img;
            if(feedImg){
                if(typeof feedImg === 'string' && (feedImg === "" || feedImg === "data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs") ){
                    this.setEmptyFeedImage();
                }
                else if(typeof feedImg === 'object' && ( feedImg.image === '' || feedImg.image === "data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs")){
                    this.setEmptyFeedImage();
                }
            }else{
                this.setEmptyFeedImage();
            }

            // Apply ellipses to words with characters numbering greater than 13
            var title = this.$el.find(".overlay-title").text();
            var titleSplit = title.split(" ");
            for (var i = 0; i < titleSplit.length; i++) {
                if (titleSplit[i].length > 13) {
                    titleSplit[i] = titleSplit[i].slice(0, 14);
                    titleSplit[i] += "…";
                }
            }
            var titleJoin = titleSplit.join(" ");
            this.$el.find(".overlay-title").text(titleJoin);

            return this;
        },

        propContent: function (event) {
            event.preventDefault();

            //if user isn't logged in, redirect them to login page
            if(!Props.Session.loggedIn){
                Backbone.history.navigate('/login',{trigger:true});
                return;
            }

            var self = this;

            var currentVal = this.model.get('props');
            self.contentId = this.model.get('content_id');

            var proped = false;

            switch($(event.target).data('action')){
                case 'prop-down':
                    self.model.sendPropVote(false,Props.Session.userID,self.contentId,function(data){
                        self.model.set('props', data.props);
                        self.render();
                        // console.log(event.currentTarget);
                        // $(event.currentTarget).data("proped", true);
                        // console.log($(event.currentTarget).data().proped);
                    });
                    break;
                case 'prop-up':
                default:
                    self.model.sendPropVote(true,Props.Session.userID,self.contentId,function(data){
                        self.model.set('props', data.props);
                        self.render();
                    });
                    break;
            }
            return false;
        },

        pieceIn: function (e) {
            var self = this;
            var parentDiv = $(e.currentTarget).parent();
            var imageDiv = parentDiv.find(".crop");
            //LOGIC for preview play
            /****** COMMENT OUT IF UNSTABLE BEGIN****/
            var $feedOverlay = parentDiv.find('.feed-hover-overlay');

            // $feedOverlay.css('opacity','1');

            imageDiv.addClass("hovered");

            this.hoverTimeout = setTimeout(function(){
                var feedImg = self.model.attributes.feed_img;
                if(feedImg && feedImg.type){
                    switch(feedImg.type){
                        case 'audio':
                            if(feedImg.filePath && feedImg.filePath!=''){
                                self.$audioPreview.attr('src',feedImg.filePath);
                                self.$audioPreview[0].load();
                                self.$audioPreview[0].play();
                            }
                        break;
                        case 'video':
                            if(feedImg.mp4 && feedImg.webm && feedImg.mp4!='' && feedImg.webm!=''){
                                var $container = $(e.target);

                                self.$videoPreview.css('width',$container.outerWidth(true));
                                self.$videoPreview.css('height',$container.outerHeight(true));
                                self.$videoPreview.css('top',0);

                                $container.after(self.$videoPreview);

                                self.$videoPreview.empty();
                                self.$videoPreview.append($('<source>').attr('src',feedImg.mp4).attr('type','video/mp4'));
                                self.$videoPreview.append($('<source>').attr('src',feedImg.webm).attr('type','video/webm'));
                                self.$videoPreview[0].load();
                                self.$videoPreview[0].play();

                                $feedOverlay.css('opacity','0');

                            }
                        break;
                    }
                }
            },1000);
            /****** COMMENT OUT IF UNSTABLE END ****/
        },

        pieceOut: function (e) {

            var self = this;
            var parentDiv = $(e.currentTarget).parent();
            var imageDiv = parentDiv.find(".crop");
            imageDiv.removeClass("hovered");

             //LOGIC for preview play
            /****** COMMENT OUT IF UNSTABLE BEGIN****/
            //stop audio and video that's playing
            self.$audioPreview[0].pause();
            self.$videoPreview[0].pause();
            self.$videoPreview.css('top','-1000px');

            if(this.hoverTimeout){

                clearTimeout(this.hoverTimeout);
            }
            /****** COMMENT OUT IF UNSTABLE END ****/
        },
        showPropLoginNotification: function (e) {
            if (!Props.Session.loggedIn){
                $(e.currentTarget).nextAll(".login-prop-notification").fadeIn();
            }
        },

        hidePropLoginNotification: function (e) {
            if(!Props.Session.loggedIn) {
                $(e.currentTarget).nextAll(".login-prop-notification").fadeOut();
            }
        },

    });

    return FeedContentView;
});
