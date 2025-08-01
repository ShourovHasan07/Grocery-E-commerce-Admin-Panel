"use client";

import { useState, useEffect } from 'react';

const TinyMCE = (props) => {
  const [Editor, setEditor] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadTinyMCE = async () => {
      try {
        // Load TinyMCE core first
        await import('tinymce/tinymce');

        // Then load all dependencies
        await Promise.all([
          import('tinymce/models/dom/model'),
          import('tinymce/themes/silver'),
          import('tinymce/icons/default'),
          import('tinymce/skins/ui/oxide/skin'),

          // Plugins
          import('tinymce/plugins/advlist'),
          import('tinymce/plugins/anchor'),
          import('tinymce/plugins/autolink'),
          import('tinymce/plugins/autoresize'),
          import('tinymce/plugins/autosave'),
          import('tinymce/plugins/charmap'),
          import('tinymce/plugins/code'),
          import('tinymce/plugins/codesample'),
          import('tinymce/plugins/directionality'),
          import('tinymce/plugins/emoticons'),
          import('tinymce/plugins/fullscreen'),
          import('tinymce/plugins/help'),
          import('tinymce/plugins/help/js/i18n/keynav/en'),
          import('tinymce/plugins/image'),
          import('tinymce/plugins/importcss'),
          import('tinymce/plugins/insertdatetime'),
          import('tinymce/plugins/link'),
          import('tinymce/plugins/lists'),
          import('tinymce/plugins/media'),
          import('tinymce/plugins/nonbreaking'),
          import('tinymce/plugins/pagebreak'),
          import('tinymce/plugins/preview'),
          import('tinymce/plugins/quickbars'),
          import('tinymce/plugins/save'),
          import('tinymce/plugins/searchreplace'),
          import('tinymce/plugins/table'),
          import('tinymce/plugins/visualblocks'),
          import('tinymce/plugins/visualchars'),
          import('tinymce/plugins/wordcount'),

          // Plugin resources
          import('tinymce/plugins/emoticons/js/emojis'),

          // Content styles
          import('tinymce/skins/content/default/content'),
          import('tinymce/skins/ui/oxide/content')
        ]);

        // Wait a bit to ensure tinymce global is available
        await new Promise(resolve => setTimeout(resolve, 100));

        // Finally load the React component
        const { Editor: TinyMCEEditor } = await import('@tinymce/tinymce-react');

        setEditor(() => TinyMCEEditor);
        setIsLoading(false);
      } catch (error) {
        // console.error('Failed to load TinyMCE:', error);
        setIsLoading(false);
      }
    };

    loadTinyMCE();
  }, []);

  if (isLoading || !Editor) {
    return <div className='h-[100px] border rounded p-2'>Loading...</div>;
  } else {
    return (
      <Editor
        licenseKey='gpl'
        {...props}
      />
    );
  }
};

export default TinyMCE;
