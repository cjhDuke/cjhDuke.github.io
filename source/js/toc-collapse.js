(function () {
  'use strict';

  function updateTocToggle($li, $childList) {
    var $toggle = $li.children('.toc-toggle');
    if ($toggle.length === 0) {
      return;
    }

    var collapsed = $childList.hasClass('tocbot-is-collapsed');
    $toggle
      .toggleClass('toc-toggle-collapsed', collapsed)
      .toggleClass('toc-toggle-expanded', !collapsed)
      .attr('aria-expanded', collapsed ? 'false' : 'true')
      .attr('aria-label', collapsed ? '展开目录' : '收起目录');
  }

  function bindTocToggle() {
    var $tocBody = jQuery('#toc-body');
    if ($tocBody.length === 0) {
      return;
    }

    $tocBody.find('.toc-list-item').each(function () {
      var $li = jQuery(this);
      var $childList = $li.children('ol');

      if ($childList.length === 0) {
        if ($li.children('.toc-toggle').length === 0) {
          $li.prepend('<span class="toc-toggle toc-toggle-placeholder" aria-hidden="true">›</span>');
        }
        return;
      }

      if ($li.children('.toc-toggle').length === 0) {
        $li.prepend('<span class="toc-toggle" role="button" tabindex="0" aria-expanded="false">›</span>');
      }

      updateTocToggle($li, $childList);
    });

    $tocBody
      .off('click.tocCollapse keydown.tocCollapse')
      .on('click.tocCollapse', '.toc-toggle', function (event) {
        event.preventDefault();
        event.stopPropagation();

        var $li = jQuery(this).parent('.toc-list-item');
        var $childList = $li.children('ol');
        if ($childList.length === 0) {
          return;
        }

        $childList.toggleClass('tocbot-is-collapsed');
        updateTocToggle($li, $childList);
      })
      .on('keydown.tocCollapse', '.toc-toggle', function (event) {
        if (event.key !== 'Enter' && event.key !== ' ') {
          return;
        }
        event.preventDefault();
        jQuery(this).trigger('click');
      });
  }

  function observeToc() {
    var tocBody = document.getElementById('toc-body');
    if (!tocBody || !window.MutationObserver || tocBody.__tocCollapseObserver) {
      return;
    }

    tocBody.__tocCollapseObserver = new MutationObserver(function (mutations) {
      var shouldBind = mutations.some(function (mutation) {
        return mutation.type === 'childList'
          || (mutation.type === 'attributes'
            && !jQuery(mutation.target).hasClass('toc-toggle'));
      });
      if (shouldBind) {
        bindTocToggle();
      }
    });

    tocBody.__tocCollapseObserver.observe(tocBody, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['class']
    });
  }

  function init() {
    if (typeof jQuery === 'undefined') {
      return;
    }

    bindTocToggle();
    observeToc();

    if (window.Fluid && Fluid.events
      && typeof Fluid.events.registerRefreshCallback === 'function') {
      Fluid.events.registerRefreshCallback(function () {
        bindTocToggle();
        observeToc();
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
