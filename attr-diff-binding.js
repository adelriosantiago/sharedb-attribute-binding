module.exports = TextDiffBinding;

function TextDiffBinding(element, attrToSet, events) {
  this.element = element;
  this.attrToSet = attrToSet;
  this.events = events; //TODO
  this.lastOp = { cursor: undefined, index: undefined, length: undefined, transformCursor: (function() {}) }; //Set last operation mock
  if (attrToSet === "class") {
    this.originalClasses = element.className;
  }
}

TextDiffBinding.prototype._get = TextDiffBinding.prototype._insert = TextDiffBinding.prototype._remove = function() {
  throw new Error(
    "`_get()`, `_insert(index, length)`, and `_remove(index, length)` prototype methods must be defined."
  );
};

TextDiffBinding.prototype._getElementValue = function() {
  var value = this.element.value || ""; //Always set the element value no matter what
  // IE and Opera replace \n with \r\n. Always store strings as \n
  return value.replace(/\r\n/g, "\n");
};

TextDiffBinding.prototype._getInputEnd = function(previous, value) {
  if (this.element !== document.activeElement) return null;
  var end = value.length - this.element.selectionStart;
  if (end === 0) return end;
  if (previous.slice(previous.length - end) !== value.slice(value.length - end))
    return null;
  return end;
};

TextDiffBinding.prototype.onInput = function() {
  var previous = this._get();
  var value = this._getElementValue();
  if (previous === value) return;

  var start = 0;
  // Attempt to use the DOM cursor position to find the end
  var end = this._getInputEnd(previous, value);
  if (end === null) {
    // If we failed to find the end based on the cursor, do a diff. When
    // ambiguous, prefer to locate ops at the end of the string, since users
    // more frequently add or remove from the end of a text input
    while (previous.charAt(start) === value.charAt(start)) {
      start++;
    }
    end = 0;
    while (
      previous.charAt(previous.length - 1 - end) ===
        value.charAt(value.length - 1 - end) &&
      end + start < previous.length &&
      end + start < value.length
    ) {
      end++;
    }
  } else {
    while (
      previous.charAt(start) === value.charAt(start) &&
      start + end < previous.length &&
      start + end < value.length
    ) {
      start++;
    }
  }

  if (previous.length !== start + end) {
    var removed = previous.slice(start, previous.length - end);
    this._remove(start, removed);
  }
  if (value.length !== start + end) {
    var inserted = value.slice(start, value.length - end);
    this._insert(start, inserted);
  }
};

TextDiffBinding.prototype.onInsert = function(index, length) {
  this._transformSelectionAndUpdate(index, length, insertCursorTransform);
};
function insertCursorTransform(index, length, cursor) {
  return index < cursor ? cursor + length : cursor;
}

TextDiffBinding.prototype.onRemove = function(index, length) {
  this._transformSelectionAndUpdate(index, length, removeCursorTransform);
};
function removeCursorTransform(index, length, cursor) {
  return index < cursor ? cursor - Math.min(length, cursor - index) : cursor;
}

TextDiffBinding.prototype._transformSelectionAndUpdate = function(
  index,
  length,
  transformCursor
) {
  if (document.activeElement === this.element) {

    let restoreCursorTo;
    let currentOp = { cursor: this.element.selectionStart, index, length, transformCursor };

    if ((this.lastOp.transformCursor.name === "removeCursorTransform") && (currentOp.transformCursor.name === "insertCursorTransform") //If the last operation was a remove
      && (this.lastOp.cursor > currentOp.index) //And it is in the range of the cursor
      && (this.lastOp.index === currentOp.index) //And it is an actual replacement because both start at the same index
    ) {
      restoreCursorTo = this.lastOp.cursor; //Save where the cursor was
    }

    this.lastOp = currentOp; //Set last op

    var selectionStart = transformCursor(
      index,
      length,
      this.element.selectionStart
    );
    var selectionEnd = transformCursor(
      index,
      length,
      this.element.selectionEnd
    );
    var selectionDirection = this.element.selectionDirection;
    this.update();
    this.element.setSelectionRange(
      selectionStart,
      selectionEnd,
      selectionDirection
    );
    
    if (restoreCursorTo) this.element.setSelectionRange(restoreCursorTo, restoreCursorTo); //Restore cursor in the event of a replacement (a `removeCursorTransform` followed by a `insertCursorTransform`)
  } else {
    this.update();
  }
};

TextDiffBinding.prototype.update = function() {
  let value = this._get();

  if (this._getElementValue() === value) return;
  this.element.value = value; //Set the element value (even if it is not an input)

  //Copy the value to the desired attribute
  if (typeof this.attrToSet === "function") {
    this.attrToSet(this.element, value);
  } else if (typeof this.attrToSet === "string") {
    if (this.attrToSet === "value") return;

    if (["id", "src", "href", "style"].indexOf(this.attrToSet) >= 0) {
      this.element.setAttribute(this.attrToSet, value);
    } else if (this.attrToSet === "html") {
      this.element.innerHTML = value;
    } else if (this.attrToSet === "class") {
      this.element.className = this.originalClasses + " " + value;
    }
  }
};
