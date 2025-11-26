import { useEffect, useState } from 'react';

/**
 * Hook to observe body class changes and update the root theme class.
 * @returns Current list of classes on the body element
 */
export const useBodyClassObserver = () => {
	const [bodyClasses, setBodyClasses] = useState<string[]>(
		Array.from(window.document.body.classList)
	);

	useEffect(() => {
		// Update theme class on the root element
		const updateThemeClass = () => {
			const root = window.document.documentElement;
			const themeClass = window.document.body.classList.contains(
				"theme-dark"
			)
				? "dark"
				: "light";
            root.classList.add(themeClass);
            console.debug(`主题已更新为: ${themeClass}`);
		};

		// Run once initially
		updateThemeClass();

		// Minimal MutationObserver to track class changes
		const handleBodyClassChange = () => {
			const newClasses = Array.from(window.document.body.classList);
            setBodyClasses(newClasses);
            console.debug("Body类发生变化:", newClasses);
			updateThemeClass();
		};

		// Observe only `class` attribute changes
		const observer = new MutationObserver(() => handleBodyClassChange());
		observer.observe(window.document.body, {
			attributes: true,
			attributeFilter: ["class"],
		});

		// Cleanup observer on unmount
		return () => observer.disconnect();
	}, []);

	return bodyClasses;
};
