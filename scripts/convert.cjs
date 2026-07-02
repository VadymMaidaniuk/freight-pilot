/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('fs');

let html = fs.readFileSync('c:\\Projects\\Business\\freight-pilot\\stitch_freightpilot_ai_quote_desk\\stitch_freightpilot_ai_quote_desk\\landing_page\\export-src.html', 'utf8');

// Extract workflowStages
const stagesMatch = html.match(/workflowStages:\s*(\[[\s\S]*?\])/);
let workflowStages = stagesMatch ? stagesMatch[1] : '[]';

// Extract HTML inside <x-dc>
const dcMatch = html.match(/<x-dc>([\s\S]*?)<\/x-dc>/);
if (!dcMatch) throw new Error("No <x-dc> found");
let body = dcMatch[1];

// Remove <helmet> and extract styles
let styles = '';
body = body.replace(/<helmet>([\s\S]*?)<\/helmet>/, (match, p1) => {
    // Extract <style>
    const styleMatch = p1.match(/<style>([\s\S]*?)<\/style>/);
    if (styleMatch) styles = styleMatch[1];
    return ''; // Remove helmet
});

// Convert class to className
body = body.replace(/class=/g, 'className=');

// Convert HTML comments to JSX comments
body = body.replace(/<!--([\s\S]*?)-->/g, '{/* $1 */}');

// Convert sc-if
body = body.replace(/<sc-if value="{{([^}]+)}}"[^>]*>([\s\S]*?)<\/sc-if>/g, (match, val, content) => {
    return `{${val.trim()} && (<>${content}</>)}`;
});

// Convert sc-for
body = body.replace(/<sc-for list="{{([^}]+)}}" as="([^"]+)"[^>]*>([\s\S]*?)<\/sc-for>/g, (match, list, asVar, content) => {
    // Handle {{ stage.num }} etc
    let inner = content.replace(/{{([^}]+)}}/g, (m, exp) => `{${exp.trim()}}`);
    return `{${list.trim()}.map((${asVar}, index) => (<React.Fragment key={index}>${inner}</React.Fragment>))}`;
});

// Convert style="a: b; c: d" to style={{ a: "b", c: "d" }}
function kebabToCamel(str) {
    if (str.startsWith('-webkit-')) {
        str = str.replace('-webkit-', 'Webkit');
    }
    return str.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
}
body = body.replace(/style="([^"]*)"/g, (match, styleStr) => {
    let rules = styleStr.split(';').filter(s => s.trim().length > 0);
    let objStr = rules.map(rule => {
        let parts = rule.split(':');
        if (parts.length < 2) return '';
        let key = kebabToCamel(parts[0].trim());
        let val = parts.slice(1).join(':').trim().replace(/"/g, "'");
        return `"${key}": "${val}"`;
    }).filter(s => s !== '').join(', ');
    return `style={{${objStr}}}`;
});

body = body.replace(/style-hover="([^"]*)"/g, (match, hoverStr) => {
    return `data-style-hover="${hoverStr}"`;
});

// Fix unclosed tags (img, br, input, hr, meta, link)
body = body.replace(/<br>/g, '<br />');
body = body.replace(/<hr>/g, '<hr />');
body = body.replace(/<img([^>]*[^/])>/g, '<img$1 />');
body = body.replace(/<input([^>]*[^/])>/g, '<input$1 />');
body = body.replace(/<meta([^>]*[^/])>/g, '<meta$1 />');
body = body.replace(/<link([^>]*[^/])>/g, '<link$1 />');

let reactCode = `
'use client';
import React, { useEffect } from 'react';

const workflowStages = ${workflowStages};

export default function LandingPage() {
  const showAnnotations = true;

  useEffect(() => {
    const els = document.querySelectorAll('[data-style-hover]');
    els.forEach(el => {
      if (el.hasAttribute('data-hover-init')) return;
      el.setAttribute('data-hover-init', 'true');
      
      const hoverStyle = el.getAttribute('data-style-hover');
      if (!hoverStyle) return;
      
      let rules = hoverStyle.split(';').filter(s => s.trim().length > 0);
      let hoverObj = {};
      rules.forEach(rule => {
        let parts = rule.split(':');
        if (parts.length >= 2) {
          let key = parts[0].trim();
          let val = parts.slice(1).join(':').trim();
          hoverObj[key] = val;
        }
      });
      
      el.addEventListener('mouseenter', () => {
        el._originalStyles = el._originalStyles || {};
        for (let key in hoverObj) {
          el._originalStyles[key] = el.style.getPropertyValue(key);
          el.style.setProperty(key, hoverObj[key]);
        }
      });
      el.addEventListener('mouseleave', () => {
        if (!el._originalStyles) return;
        for (let key in hoverObj) {
          if (el._originalStyles[key]) {
            el.style.setProperty(key, el._originalStyles[key]);
          } else {
            el.style.removeProperty(key);
          }
        }
      });
    });
  }, []);

  return (
    <>
      <style dangerouslySetInnerHTML={{__html: \`${styles}\`}} />
      ${body}
    </>
  );
}
`;

fs.writeFileSync('c:\\Projects\\Business\\freight-pilot\\src\\app\\page.tsx', reactCode);
console.log("Conversion successful");
