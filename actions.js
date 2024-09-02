
// default priority level for actions
const defaultPriority = 0;

// function to load a YAML file and parse its contents
const loadYAMLFile = async (filePath) => {
    try { 
        // fetch the YAML file from the same path as js and html files
        const response = await fetch(filePath);

        if (!response.ok) {
            throw new Error(`Failed to load file: ${filePath}`);
        }

        // read the text content of the YAML file
        const yamlText = await response.text();

        return jsyaml.load(yamlText); 

    } catch (error) {
        console.error(`Error loading YAML file ${filePath}:`, error);
        return null;
    }
};

// function to load and merge configurations from multiple YAML files
const loadAndMergeConfigurations = async () => {
    // array of YAML files
    const configFiles = ['A.yaml', 'B.yaml']; 
    const mergedConfig = { actions: [] };

    // iterate over each file and merge its actions
    for (const file of configFiles) {
        const config = await loadYAMLFile(file);
        
        // log the loaded configuration on the console
        console.log(`Loaded configuration from ${file}:`, config);

        // merge actions if they are present in the loaded configuration
        if (config && config.actions) {
            mergedConfig.actions.push(...config.actions);
        }
    }

    return mergedConfig;
};

// function to apply configuration actions to the DOM
const applyConfiguration = (config) => {
    // check if the config.actions is valid and defined
    if (!config?.actions?.length) {
        console.warn('Invalid or empty configuration');
        return;
    }

    // sort actions by priority, if not specified consider defaultPriority
    const actions = config.actions
        .sort((a, b) => (a.priority ?? defaultPriority) - (b.priority ?? defaultPriority));

    actions.forEach((action) => {
        try {
            switch (action.type) {
                case 'remove':
                    handleRemoveAction(action);
                    break;
                case 'replace':
                    handleReplaceAction(action);
                    break;
                case 'insert':
                    handleInsertAction(action);
                    break;
                case 'alter':
                    handleAlterAction(action);
                    break;
                default:
                    console.error(`Unsupported action type: ${action.type}`);
            }
        } catch (error) {
            // log any errors for the specific action while applying them
            console.error('Error applying action:', action, '- Error message:', error.message);
        }
    }); 
};


// function to handle remove actions
const handleRemoveAction = (action) => {
    document.querySelectorAll(action.selector).forEach((element) => element.remove());
};

// function to handle replace actions
const handleReplaceAction = (action) => {
    document.querySelectorAll(action.selector).forEach((element) => {
        const newElement = document.createRange().createContextualFragment(action.newElement);
        element.replaceWith(newElement);
    });
};

// function to handle insert actions
const handleInsertAction = ({ target, element, position }) => {
    // find the target element
    const targetElement = document.querySelector(target);

    if (!targetElement) {
        throw new Error(`Target element not found: ${target}`);
    }

    // create a new element to insert
    const newElementToInsert = document.createRange().createContextualFragment(element);

    // insert the new element at the specified positions below
    if (position === 'after') {
        targetElement.parentNode.insertBefore(newElementToInsert, targetElement.nextSibling);
    } else if (position === 'before') {
        targetElement.parentNode.insertBefore(newElementToInsert, targetElement);
    } else {
        throw new Error(`Unsupported position: ${position}`);
    }
};

// function to handle alter actions
const handleAlterAction = (action) => {
    // ensure both oldValue and newValue are provided
    if (!action.oldValue || !action.newValue) {
        throw new Error('Alter action requires both oldValue and newValue');
    }

    // replace oldValue with newValue in the document body
    document.body.innerHTML = document.body.innerHTML.replace(new RegExp(action.oldValue, 'g'), action.newValue);
};

// initialization function to load and apply configurations
const init = async () => {
    const config = await loadAndMergeConfigurations();
    console.log('Merged configuration:', config);

    applyConfiguration(config);
};

// run the initialization function when the DOM content is loaded
document.addEventListener('DOMContentLoaded', init);