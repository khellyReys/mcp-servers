/**
 * Function to create a campaign for app promotion using the Facebook Marketing API.
 *
 * @param {Object} args - Arguments for creating the campaign.
 * @param {string} args.account_id - The Ad Account ID to create the campaign under.
 * @param {string} args.token - The access token for authorization.
 * @param {string} [args.name="PostManCampaignAwareness"] - The name of the campaign.
 * @param {string} [args.objective="OUTCOME_APP_PROMOTION"] - The objective of the campaign.
 * @param {string} [args.status=""] - The status of the campaign.
 * @param {Array} [args.special_ad_categories=[]] - Special ad categories for the campaign.
 * @returns {Promise<Object>} - The result of the campaign creation.
 */
const executeFunction = async ({ account_id, token, name = "PostManCampaignAwareness", objective = "OUTCOME_APP_PROMOTION", status = "", special_ad_categories = [] }) => {
  const baseUrl = ''; // Base URL will be provided by the user
  const campaignUrl = `${baseUrl}/act_${account_id}/campaigns?name=${encodeURIComponent(name)}&objective=${encodeURIComponent(objective)}&status=${encodeURIComponent(status)}&special_ad_categories=${encodeURIComponent(JSON.stringify(special_ad_categories))}`;
  
  try {
    // Set up headers for the request
    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };

    // Perform the fetch request
    const response = await fetch(campaignUrl, {
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
 * Tool configuration for creating a campaign for app promotion using the Facebook Marketing API.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'create_campaign',
      description: 'Create a campaign for app promotion using the Facebook Marketing API.',
      parameters: {
        type: 'object',
        properties: {
          account_id: {
            type: 'string',
            description: 'The Ad Account ID to create the campaign under.'
          },
          token: {
            type: 'string',
            description: 'The access token for authorization.'
          },
          name: {
            type: 'string',
            description: 'The name of the campaign.'
          },
          objective: {
            type: 'string',
            description: 'The objective of the campaign.'
          },
          status: {
            type: 'string',
            description: 'The status of the campaign.'
          },
          special_ad_categories: {
            type: 'array',
            description: 'Special ad categories for the campaign.'
          }
        },
        required: ['account_id', 'token']
      }
    }
  }
};

export { apiTool };