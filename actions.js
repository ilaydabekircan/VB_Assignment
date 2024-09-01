

const handleRemoveAction = (action) => {
    document.querySelectorAll(action.selector).forEach((element) => element.remove());
};

const handleReplaceAction = (action) => {
    document.querySelectorAll(action.selector).forEach((element) => {
        const newElement = document.createRange().createContextualFragment(action.newElement);
        element.replaceWith(newElement);
    });
};

const handleInsertAction = ({ target, element, position }) => {
    const targetElement = document.querySelector(target);

    if (!targetElement) {
        throw new Error(`Target element not found: ${target}`);
    }

    const newElementToInsert = document.createRange().createContextualFragment(element);

    if (position === 'after') {
        targetElement.parentNode.insertBefore(newElementToInsert, targetElement.nextSibling);
    } else if (position === 'before') {
        targetElement.parentNode.insertBefore(newElementToInsert, targetElement);
    } else {
        throw new Error(`Unsupported position: ${position}`);
    }
};

const handleAlterAction = (action) => {
    if (!action.oldValue || !action.newValue) {
        throw new Error('Alter action requires both oldValue and newValue');
    }

    document.body.innerHTML = document.body.innerHTML.replace(new RegExp(action.oldValue, 'g'), action.newValue);
};
