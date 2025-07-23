/**
 * Function to update AdAccount basic details in the Marketing API.
 *
 * @param {Object} args - Arguments for updating the AdAccount.
 * @param {string} args.account_id - The ID of the AdAccount to update.
 * @param {number} args.spend_cap - The spend cap for the AdAccount.
 * @param {string} args.name - The new name for the AdAccount.
 * @param {boolean} args.notifications_enabled - Whether notifications are enabled for the AdAccount.
 * @returns {Promise<Object>} - The result of the AdAccount update.
 */
const executeFunction = async ({ account_id, spend_cap, name, notifications_enabled }) => {
  const baseUrl = ''; // will be provided by the user
  const token = process.env.FACEBOOK_MARKETING_API_API_KEY;
  try {
    // Construct the URL for the request
    const url = `${baseUrl}/act_${account_id}?spend_cap=${spend_cap}&name=${encodeURIComponent(name)}&notifications_enabled=${notifications_enabled}`;

    // Set up headers for the request
    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };

    // Perform the fetch request
    const response = await fetch(url, {
      method: 'POST',
      headers
    });

    // Check if the response was successful
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData);
    }

    // Parse and return the response data
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error updating AdAccount details:', error);
    return { error: 'An error occurred while updating AdAccount details.' };
  }
};

/**
 * Tool configuration for updating AdAccount basic details in the Marketing API.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'update_ad_account',
      description: 'Update AdAccount basic details in the Marketing API.',
      parameters: {
        type: 'object',
        properties: {
          account_id: {
            type: 'string',
            description: 'The ID of the AdAccount to update.'
          },
          spend_cap: {
            type: 'number',
            description: 'The spend cap for the AdAccount.'
          },
          name: {
            type: 'string',
            description: 'The new name for the AdAccount.'
          },
          notifications_enabled: {
            type: 'boolean',
            description: 'Whether notifications are enabled for the AdAccount.'
          }
        },
        required: ['account_id', 'spend_cap', 'name', 'notifications_enabled']
      }
    }
  }
};

export { apiTool };