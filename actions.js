

const loadYAMLFile = async (filePath) => {
    try { 
        const response = await fetch(filePath);

        if (!response.ok) {
            throw new Error(`Failed to load file: ${filePath}`);
        }

        const yamlText = await response.text();

        return jsyaml.load(yamlText); 

    } catch (error) {
        console.error(`Error loading YAML file ${filePath}:`, error);
        return null;
    }
};


// Merge multiple YAML configurations
const loadAndMergeConfigurations = async () => {
    const configFiles = ['A.yaml', 'B.yaml']; // Directly load these files
    const mergedConfig = { actions: [] };

    for (const file of configFiles) {
        const config = await loadYAMLFile(file);
        
        // Log the loaded configuration for debugging
        console.log(`Loaded configuration from ${file}:`, config);

        if (config && config.actions) {
            mergedConfig.actions.push(...config.actions);
        }
    }

    return mergedConfig;
};




const applyConfiguration = (config) => {
    if (!config?.actions?.length) {
        console.warn('Invalid or empty configuration');
        return;
    }

    // Iterate over config.actions instead of actions
    config.actions.forEach((action) => {
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
            console.error('Error applying action:', action, '- Error message:', error.message);
        }
    }); 
};




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

// Initialize the configuration process
const init = async () => {
    const config = await loadAndMergeConfigurations();
    console.log('Merged configuration:', config); // For debugging

    applyConfiguration(config);
};

// Run the initialization after the DOM is fully loaded
document.addEventListener('DOMContentLoaded', init);