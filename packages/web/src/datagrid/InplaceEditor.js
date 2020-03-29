// @ts-nocheck

import _ from 'lodash';
import React from 'react';
import styled from 'styled-components';
import theme from '../theme';
import keycodes from '../utility/keycodes';
import { setChangeSetValue } from '@dbgate/datalib';

const StyledInput = styled.input`
  border: 0px solid;
  outline: none;
  margin: 0px;
  padding: 0px;
`;

export default function InplaceEditor({
  widthPx,
  definition,
  changeSet,
  setChangeSet,
  cellValue,
  inplaceEditorState,
  dispatchInsplaceEditor,
  isInsertedRow,
}) {
  const editorRef = React.useRef();
  const isChangedRef = React.useRef(!!inplaceEditorState.text);
  React.useEffect(() => {
    const editor = editorRef.current;
    editor.value = inplaceEditorState.text || cellValue;
    editor.focus();
    if (inplaceEditorState.selectAll) {
      editor.select();
    }
  }, []);
  function handleBlur() {
    if (isChangedRef.current) {
      const editor = editorRef.current;
      setChangeSet(setChangeSetValue(changeSet, definition, editor.value));
      isChangedRef.current = false;
    }
    dispatchInsplaceEditor({ type: 'close' });
  }
  if (inplaceEditorState.shouldSave) {
    const editor = editorRef.current;
    if (isChangedRef.current) {
      setChangeSet(setChangeSetValue(changeSet, definition, editor.value));
      isChangedRef.current = false;
    }
    editor.blur();
    dispatchInsplaceEditor({ type: 'close', mode: 'save' });
  }
  function handleKeyDown(event) {
    const editor = editorRef.current;
    switch (event.keyCode) {
      case keycodes.escape:
        isChangedRef.current = false;
        dispatchInsplaceEditor({ type: 'close' });
        break;
      case keycodes.enter:
        if (isChangedRef.current) {
          setChangeSet(setChangeSetValue(changeSet, definition, editor.value));
          isChangedRef.current = false;
        }
        editor.blur();
        dispatchInsplaceEditor({ type: 'close', mode: 'enter' });
        break;
      case keycodes.s:
        if (event.ctrlKey) {
          if (isChangedRef.current) {
            setChangeSet(setChangeSetValue(changeSet, definition, editor.value));
            isChangedRef.current = false;
          }
          event.preventDefault();
          dispatchInsplaceEditor({ type: 'close', mode: 'save' });
        }
        break;
    }
  }
  return (
    <StyledInput
      onBlur={handleBlur}
      ref={editorRef}
      type="text"
      onChange={() => (isChangedRef.current = true)}
      onKeyDown={handleKeyDown}
      style={{
        width: widthPx,
        minWidth: widthPx,
        maxWidth: widthPx,
      }}
    />
  );
}
