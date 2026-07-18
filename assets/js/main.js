(function () {
	'use strict';

	// Bỏ hiệu ứng preload sau khi trang tải xong.
	window.addEventListener('load', function () {
		setTimeout(function () {
			document.body.classList.remove('is-preload');
		}, 100);
	});

	var navLinks = Array.prototype.slice.call(document.querySelectorAll('#nav a'));
	var sections = navLinks
		.map(function (a) {
			var id = a.getAttribute('href');
			return id && id.charAt(0) === '#' ? document.querySelector(id) : null;
		})
		.filter(Boolean);

	// Cuộn mượt khi bấm vào menu, có trừ chiều cao header trên mobile.
	navLinks.forEach(function (a) {
		a.addEventListener('click', function (e) {
			var id = a.getAttribute('href');
			if (id.charAt(0) !== '#') return;
			var target = document.querySelector(id);
			if (!target) return;
			e.preventDefault();
			target.scrollIntoView({ behavior: 'smooth', block: 'start' });
		});
	});

	// Scroll-spy: tô sáng mục nav tương ứng với section đang xem.
	if ('IntersectionObserver' in window && sections.length) {
		var observer = new IntersectionObserver(
			function (entries) {
				entries.forEach(function (entry) {
					if (!entry.isIntersecting) return;
					var id = '#' + entry.target.id;
					navLinks.forEach(function (a) {
						a.classList.toggle('active', a.getAttribute('href') === id);
					});
				});
			},
			{ rootMargin: '-40% 0px -50% 0px', threshold: 0 }
		);
		sections.forEach(function (s) { observer.observe(s); });
	}

	// Lightbox: click vào ảnh để xem kích thước gốc.
	var overlay = document.createElement('div');
	overlay.className = 'lightbox-overlay';
	overlay.innerHTML = '<button type="button" class="lightbox-close" aria-label="Đóng">&times;</button><img alt="" />';
	document.body.appendChild(overlay);
	var overlayImg = overlay.querySelector('img');

	function openLightbox(src, alt) {
		overlayImg.src = src;
		overlayImg.alt = alt || '';
		overlay.classList.add('is-visible');
		document.body.style.overflow = 'hidden';
	}
	function closeLightbox() {
		overlay.classList.remove('is-visible');
		document.body.style.overflow = '';
	}

	document.querySelectorAll('a.lightbox').forEach(function (a) {
		a.addEventListener('click', function (e) {
			e.preventDefault();
			var img = a.querySelector('img');
			if (!img) return;
			openLightbox(img.getAttribute('src'), img.getAttribute('alt'));
		});
	});

	overlay.addEventListener('click', function (e) {
		if (e.target === overlay) closeLightbox();
	});
	overlay.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
	document.addEventListener('keydown', function (e) {
		if (e.key === 'Escape') closeLightbox();
	});
})();
