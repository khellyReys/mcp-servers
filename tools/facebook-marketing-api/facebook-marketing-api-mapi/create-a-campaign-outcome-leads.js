/**
 * Function to create a campaign in the Facebook Marketing API.
 *
 * @param {Object} args - Arguments for creating a campaign.
 * @param {string} args.account_id - The ad account ID to create the campaign in.
 * @param {string} args.token - The access token for authentication.
 * @param {string} [args.name="PostManCampaignLeads"] - The name of the campaign.
 * @param {string} [args.objective="OUTCOME_LEADS"] - The objective of the campaign.
 * @param {string} [args.status="PAUSED"] - The status of the campaign.
 * @param {string} [args.bid_strategy="LOWEST_COST_WITH_BID_CAP"] - The bid strategy for the campaign.
 * @param {number} [args.daily_budget=100.00] - The daily budget for the campaign.
 * @returns {Promise<Object>} - The result of the campaign creation.
 */
const executeFunction = async ({ account_id, token, name = "PostManCampaignLeads", objective = "OUTCOME_LEADS", status = "PAUSED", bid_strategy = "LOWEST_COST_WITH_BID_CAP", daily_budget = 100.00 }) => {
  const baseUrl = 'https://graph.facebook.com/v12.0';
  const accessToken = token; // will be provided by the user

  try {
    // Construct the URL for the request
    const url = `${baseUrl}/act_${account_id}/campaigns`;

    // Set up headers for the request
    const headers = {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    };

    // Set up the body for the request
    const body = {
      name,
      objective,
      status,
      bid_strategy,
      daily_budget: daily_budget * 100, // Facebook API expects budget in cents
      special_ad_categories: []
    };

    // Perform the fetch request
    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(body)
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
 * Tool configuration for creating a campaign in the Facebook Marketing API.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'CreateACampaignOutcomeLeads',
      description: 'Create a campaign in the Facebook Marketing API.',
      parameters: {
        type: 'object',
        properties: {
          account_id: {
            type: 'string',
            description: 'The ad account ID to create the campaign in.'
          },
          token: {
            type: 'string',
            description: 'The access token for authentication.'
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
          bid_strategy: {
            type: 'string',
            description: 'The bid strategy for the campaign.'
          },
          daily_budget: {
            type: 'number',
            description: 'The daily budget for the campaign.'
          }
        },
        required: ['account_id', 'token']
      }
    }
  }
};

export { apiTool };