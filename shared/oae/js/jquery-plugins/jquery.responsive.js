/*!
 * Copyright 2013 Apereo Foundation (AF) Licensed under the
 * Educational Community License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License. You may
 * obtain a copy of the License at
 *
 *     http://opensource.org/licenses/ECL-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an "AS IS"
 * BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express
 * or implied. See the License for the specific language governing
 * permissions and limitations under the License.
 */

/**
 * Utility plugin that handles the responsive left hand navigation interactions.
 *     - Ability to open and close the navigation using the `.oae-lhnavigation-toggle` class on desktop and mobile.
 *     - Toggling the visiblity of the navigation uses animation to fade-in/fade-out on desktop and mobile.
 *     - When a `page link` is clicked on a mobile device the navigation will close (does not apply on desktop). The navigation stays visible when an `action button` is clicked as this doesn't show a new page.
 */

define(['jquery', 'oae.api.util'], function (jQuery, oaeUtil) {
    var $ = jQuery;
    var LHNAVIGATION_WIDTH = 210;

    /**
     * Open the left hand navigation
     */
    var openLhNav = function() {

        // Animate the opacity and width
        $('.oae-lhnavigation').addClass('oae-lhnav-expanded');
        $('.oae-lhnavigation').css({
            'opacity': 1,
            'width': LHNAVIGATION_WIDTH + 'px'
        });

        // We want the page to slide rather than squish, so freeze its width to the current size
        $('.oae-page').css({
            'min-width': $('.oae-page').css('width')
        });

        // Animate the margin of the page to the width of the left hand nav + some additional space
        $('.oae-page').css({
            'margin-left': (LHNAVIGATION_WIDTH + 10) + 'px'
        });
    };

    /**
     * Close the left hand navigation
     */
    var closeLhNav = function() {
        // Transform the width and opacity of the navigation to close it
        $('.oae-lhnavigation').css({
            'opacity': 0,
            'width': 0
        });

        $('.oae-lhnavigation').removeClass('oae-lhnav-expanded');
        $('.oae-page').css({
            'margin-left': 0
        });
    };

    /**
     * Close the left hand navigation when clicking a navigation link on a handheld device.
     * Actions in the left hand navigation trigger a widget and shouldn't close the left hand navigation.
     * If the user is on a desktop browser the left hand navigation should never close automatically.
     */
    $(document).on('click', '.oae-lhnavigation > ul > li:not(.oae-lhnavigation-action)', function() {
        if (oaeUtil.isHandheldDevice()) {
            closeLhNav();
        }
    });

    /**
     * Toggle the left hand navigation with animation. The left hand navigation can only
     * be toggled in small and extra small viewports.
     */
    $(document).on('click', '.oae-lhnavigation-toggle', function(ev) {
        console.log('toggled');
        // If the left hand navigation is open, close it
        if ($('.oae-lhnavigation').hasClass('oae-lhnav-expanded')) {
            console.log('was open');
            closeLhNav();
        // If the left hand navigation is closed, open it
        } else {
            console.log('was closed');
            openLhNav();
        }
    });
});
