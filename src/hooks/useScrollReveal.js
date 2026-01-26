import { useEffect } from 'react';

export const useScrollReveal = () => {
    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    observer.unobserve(entry.target); // Stop observing once revealed
                }
            });
        }, { threshold: 0.1 });

        const handleMutations = (mutations) => {
            mutations.forEach(mutation => {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === 1) { // Element
                        if (node.classList.contains('reveal')) {
                            observer.observe(node);
                        }
                        // Also check children
                        node.querySelectorAll('.reveal').forEach(el => observer.observe(el));
                    }
                });
            });
        };

        const mutationObserver = new MutationObserver(handleMutations);
        mutationObserver.observe(document.body, { childList: true, subtree: true });

        // Initial check
        document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

        return () => {
            observer.disconnect();
            mutationObserver.disconnect();
        };
    }, []);
};
