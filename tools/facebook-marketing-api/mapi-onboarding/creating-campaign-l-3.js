/**
 * Function to create a campaign in the Marketing API.
 *
 * @param {Object} args - Arguments for creating the campaign.
 * @param {string} args.account_id - The account ID to create the campaign under.
 * @param {string} args.name - The name of the campaign.
 * @param {string} args.objective - The objective of the campaign.
 * @param {string} args.special_ad_categories - Special ad categories for the campaign.
 * @param {string} args.status - The status of the campaign.
 * @param {string} args.buying_type - The buying type for the campaign.
 * @returns {Promise<Object>} - The result of the campaign creation.
 */
const executeFunction = async ({ account_id, name, objective, special_ad_categories, status, buying_type }) => {
  const baseUrl = ''; // will be provided by the user
  const token = process.env.FACEBOOK_MARKETING_API_API_KEY;
  try {
    // Construct the URL for the campaign creation
    const url = `${baseUrl}/act_${account_id}/campaigns?name=${encodeURIComponent(name)}&objective=${encodeURIComponent(objective)}&special_ad_categories=${encodeURIComponent(special_ad_categories)}&status=${encodeURIComponent(status)}&buying_type=${encodeURIComponent(buying_type)}`;

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
    console.error('Error creating campaign:', error);
    return { error: 'An error occurred while creating the campaign.' };
  }
};

/**
 * Tool configuration for creating a campaign in the Marketing API.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'create_campaign',
      description: 'Create a campaign in the Marketing API.',
      parameters: {
        type: 'object',
        properties: {
          account_id: {
            type: 'string',
            description: 'The account ID to create the campaign under.'
          },
          name: {
            type: 'string',
            description: 'The name of the campaign.'
          },
          objective: {
            type: 'string',
            description: 'The objective of the campaign.'
          },
          special_ad_categories: {
            type: 'string',
            description: 'Special ad categories for the campaign.'
          },
          status: {
            type: 'string',
            description: 'The status of the campaign.'
          },
          buying_type: {
            type: 'string',
            description: 'The buying type for the campaign.'
          }
        },
        required: ['account_id', 'name', 'objective', 'special_ad_categories', 'status', 'buying_type']
      }
    }
  }
};

export { apiTool };