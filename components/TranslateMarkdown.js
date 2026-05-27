"use client";

import { useEffect, useState } from 'react';
import React from 'react';
import TranslateText from './TranslateText';

// Recursive helper to convert DOM nodes to React elements, wrapping text nodes in TranslateText
function domToReact(node, key = 0) {
  if (node.nodeType === 3) { // Node.TEXT_NODE
    const text = node.textContent;
    if (!text.trim()) {
      return text;
    }
    return <TranslateText key={key} text={text} />;
  }

  if (node.nodeType === 1) { // Node.ELEMENT_NODE
    const tagName = node.tagName.toLowerCase();
    const attrs = {};

    // Copy element attributes
    for (let i = 0; i < node.attributes.length; i++) {
      const attr = node.attributes[i];
      if (attr.name === 'class') {
        attrs.className = attr.value;
      } else {
        attrs[attr.name] = attr.value;
      }
    }

    // Recursively process child nodes
    const children = Array.from(node.childNodes).map((child, idx) =>
      domToReact(child, idx)
    );

    attrs.key = key;
    return React.createElement(tagName, attrs, ...children);
  }

  return null;
}

export default function TranslateMarkdown({ html }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Render raw HTML on the server and during hydration to prevent hydration mismatches
    return <div dangerouslySetInnerHTML={{ __html: html }} />;
  }

  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const nodes = Array.from(doc.body.childNodes).map((child, idx) => domToReact(child, idx));
    return <>{nodes}</>;
  } catch (e) {
    console.error("DOMParser translation conversion failed, falling back to raw html:", e);
    return <div dangerouslySetInnerHTML={{ __html: html }} />;
  }
}
