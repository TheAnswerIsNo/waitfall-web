import Copy from '@/components/Copy';
import { Typography } from 'antd';
import 'highlight.js/styles/github.css';
import React, { useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';

const Markdown: React.FC<{ content: string }> = ({ content }) => {
  const markdownit = require('markdown-it');
  const hljs = require('highlight.js');
  // 引入highlight.js的样式，可以选择喜欢的主题

  // 配置markdown-it，添加代码高亮功能
  const md = markdownit({
    html: true,
    breaks: true,
    linkify: true,
    typographer: true,
    highlight: function (str: any, lang: any) {
      if (lang && hljs.getLanguage(lang)) {
        try {
          return `<pre class="hljs code-block-wrapper"><div class="code-copy-btn"><span class="copy-btn-placeholder"></span></div><code class="language-${lang}">${
            hljs.highlight(str, { language: lang, ignoreIllegals: true }).value
          }</code></pre>`;
        } catch (__) {}
      }
      // 使用默认的转义
      return `<pre class="hljs code-block-wrapper"><div class="code-copy-btn"><span class="copy-btn-placeholder"></span></div><code>${md.utils.escapeHtml(
        str,
      )}</code></pre>`;
    },
  });

  // 添加markdown-it插件以增强功能
  // 如果需要表格支持
  // md.use(require('markdown-it-table'));
  // 如果需要任务列表支持
  md.use(require('markdown-it-task-lists'));
  // 如果需要上标下标支持
  md.use(require('markdown-it-sub'));
  md.use(require('markdown-it-sup'));

  // 在组件挂载后为代码块添加复制按钮
  useEffect(() => {
    const codeBlocks = document.querySelectorAll('.code-copy-btn');
    codeBlocks.forEach((block) => {
      const codeElement = block.parentElement?.querySelector('code');
      if (codeElement) {
        const codeContent = codeElement.textContent || '';
        // 创建复制按钮的React元素
        const copyButton = document.createElement('div');
        // 渲染Copy组件到这个div
        createRoot(copyButton).render(<Copy content={codeContent} />);
        // 替换占位符
        const placeholder = block.querySelector('.copy-btn-placeholder');
        if (placeholder) {
          placeholder.replaceWith(copyButton);
        }
      }
    });
  }, [content]);

  return (
    <Typography>
      {/* biome-ignore lint/security/noDangerouslySetInnerHtml: used in demo */}
      <div
        className="markdown-body"
        dangerouslySetInnerHTML={{ __html: md.render(content) }}
      />
    </Typography>
  );
};

export default Markdown;
