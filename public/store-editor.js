(function() {
  'use strict';
  
  if (window.StoreEditorLoaded) return;
  window.StoreEditorLoaded = true;
  
  window.StoreEditor = {
    editMode: false,
    
    enableEditMode: function() {
      if (this.editMode) return;
      this.editMode = true;
      
      const style = document.createElement('style');
      style.id = 'store-editor-styles';
      style.textContent = `
        .store-editor-editable {
          cursor: pointer !important;
          outline: 2px dashed transparent !important;
          transition: all 0.2s ease !important;
        }
        .store-editor-editable:hover {
          outline: 2px dashed #9333ea !important;
          background-color: rgba(147, 51, 234, 0.1) !important;
        }
        .store-editor-selected {
          outline: 3px solid #9333ea !important;
          background-color: rgba(147, 51, 234, 0.2) !important;
        }
      `;
      document.head.appendChild(style);
      
      const editables = document.querySelectorAll('h1, h2, h3, h4, p, span, a:not([href^="/admin"]), button, img');
      const self = this;
      editables.forEach(el => {
        el.classList.add('store-editor-editable');
        el.addEventListener('click', function(e) { self.handleElementClick(e); });
      });
      
      console.log('[Store Editor] Edit mode enabled');
    },
    
    disableEditMode: function() {
      this.editMode = false;
      
      const style = document.getElementById('store-editor-styles');
      if (style) style.remove();
      
      const editables = document.querySelectorAll('.store-editor-editable');
      editables.forEach(el => {
        el.classList.remove('store-editor-editable', 'store-editor-selected');
        el.removeEventListener('click', this.handleElementClick);
      });
      
      console.log('[Store Editor] Edit mode disabled');
    },
    
    handleElementClick: function(e) {
      e.preventDefault();
      e.stopPropagation();
      
      const target = e.target;
      
      document.querySelectorAll('.store-editor-selected').forEach(el => {
        el.classList.remove('store-editor-selected');
      });
      
      target.classList.add('store-editor-selected');
      
      let selector = target.tagName.toLowerCase();
      if (target.id) {
        selector = '#' + target.id;
      } else {
        const path = [];
        let current = target;
        while (current && current !== document.body) {
          let sel = current.tagName.toLowerCase();
          if (current.className && typeof current.className === 'string') {
            const classes = current.className.split(' ').filter(c => c && !c.includes('store-editor'));
            if (classes.length) sel += '.' + classes.join('.');
          }
          if (current.id) sel = '#' + current.id;
          path.unshift(sel);
          current = current.parentElement;
        }
        selector = path.join(' > ');
      }
      
      const isImage = target.tagName === 'IMG';
      const content = isImage ? target.src : (target.textContent || target.innerText || '');
      
      window.parent.postMessage({
        type: 'ELEMENT_SELECTED',
        selector: selector,
        content: content,
        elementType: target.tagName.toLowerCase()
      }, '*');
    },
    
    updateElement: function(selector, newContent, type) {
      try {
        const el = document.querySelector(selector);
        if (!el) {
          console.error('[Store Editor] Element not found:', selector);
          return false;
        }
        
        if (type === 'image' || el.tagName === 'IMG') {
          el.src = newContent;
        } else {
          el.textContent = newContent;
        }
        
        return true;
      } catch (e) {
        console.error('[Store Editor] Failed to update element:', e);
        return false;
      }
    }
  };
  
  window.addEventListener('message', function(event) {
    if (event.data.type === 'ENABLE_EDIT_MODE') {
      window.StoreEditor.enableEditMode();
    } else if (event.data.type === 'DISABLE_EDIT_MODE') {
      window.StoreEditor.disableEditMode();
    } else if (event.data.type === 'UPDATE_ELEMENT') {
      window.StoreEditor.updateElement(event.data.selector, event.data.content, event.data.elementType);
    }
  });
  
  console.log('[Store Editor] Script loaded');
})();
