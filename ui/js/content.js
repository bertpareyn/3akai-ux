/*!
 * Copyright 2012 Sakai Foundation (SF) Licensed under the
 * Educational Community License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License. You may
 * obtain a copy of the License at
 *
 *     http://www.osedu.org/licenses/ECL-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an "AS IS"
 * BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express
 * or implied. See the License for the specific language governing
 * permissions and limitations under the License.
 */

// TODO: Remove this once we have a better way of sharing data
var sakai_global = sakai_global || {};

require(['jquery','oae.core'], function($, oae) {

    //  Get the content id from the URL. The expected URL is /content/<groupId>
    var contentId = document.location.pathname.split('/').pop();
    if (!contentId) {
        oae.api.util.redirect().login();
    }

    // Variable used to cache the requested content profile
    var contentProfile = null;

    /**
     * Get the content's basic profile and set up the screen. If the content
     * can't be found or is private to the current user, the appropriate
     * error page will be shown
     */
    var getContentProfile = function() {
        oae.api.content.getContent(contentId, function(err, profile) {
            if (err) {
                if (err.code === 401) {
                    oae.api.util.redirect().notfound();
                } else {
                    oae.api.util.redirect().accessdenied();
                }
            }

            contentProfile = profile;

            // TODO: Remove this
            sakai_global.contentProfile = contentProfile;
            $(window).trigger('ready.content.oae');

            // Render the entity information
            setUpClip();

            // Insert the preview
            oae.api.widget.insertWidget('contentpreview', null, $('#content_preview_container'), null, contentProfile);
            // Set the browser title
            oae.api.util.setBrowserTitle(contentProfile.displayName);
            // We can now unhide the page
            oae.api.util.showPage();
        });
    };

    $(document).on('oae-trigger-requestcontext', function() {
        $(document).trigger('oae-trigger-receivecontext', contentProfile);
    });

    /**
     * Render the content's clip, containing the thumbnail, display name as well as the
     * content's admin options
     */
    var setUpClip = function() {
        oae.api.util.template().render($('#content-clip-template'), {'content': contentProfile}, $('#content-clip-container'));
    };

    getContentProfile();

});
