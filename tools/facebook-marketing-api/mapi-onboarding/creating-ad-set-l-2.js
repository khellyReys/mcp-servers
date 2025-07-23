/**
 * Function to create an ad set in the Marketing API.
 *
 * @param {Object} args - Arguments for creating the ad set.
 * @param {string} args.name - The name of the ad set.
 * @param {string} args.objective - The objective of the ad set.
 * @param {string} args.billing_event - The billing event for the ad set.
 * @param {string} args.status - The status of the ad set.
 * @param {Object} args.targeting - The targeting criteria for the ad set.
 * @param {number} args.daily_budget - The daily budget for the ad set.
 * @param {string} args.campaign_id - The ID of the campaign to which the ad set belongs.
 * @param {string} args.bid_strategy - The bid strategy for the ad set.
 * @returns {Promise<Object>} - The result of the ad set creation.
 */
const executeFunction = async ({ name, objective, billing_event, status, targeting, daily_budget, campaign_id, bid_strategy }) => {
  const baseUrl = ''; // will be provided by the user
  const accountId = ''; // will be provided by the user
  const token = process.env.FACEBOOK_MARKETING_API_API_KEY;

  try {
    // Construct the URL for the request
    const url = `${baseUrl}/act_${accountId}/adsets?name=${encodeURIComponent(name)}&objective=${encodeURIComponent(objective)}&billing_event=${encodeURIComponent(billing_event)}&status=${encodeURIComponent(status)}&targeting=${encodeURIComponent(JSON.stringify(targeting))}&daily_budget=${daily_budget}&campaign_id=${campaign_id}&bid_strategy=${encodeURIComponent(bid_strategy)}`;

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
    console.error('Error creating ad set:', error);
    return { error: 'An error occurred while creating the ad set.' };
  }
};

/**
 * Tool configuration for creating an ad set in the Marketing API.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'create_ad_set',
      description: 'Create an ad set in the Marketing API.',
      parameters: {
        type: 'object',
        properties: {
          name: {
            type: 'string',
            description: 'The name of the ad set.'
          },
          objective: {
            type: 'string',
            description: 'The objective of the ad set.'
          },
          billing_event: {
            type: 'string',
            description: 'The billing event for the ad set.'
          },
          status: {
            type: 'string',
            description: 'The status of the ad set.'
          },
          targeting: {
            type: 'object',
            description: 'The targeting criteria for the ad set.'
          },
          daily_budget: {
            type: 'integer',
            description: 'The daily budget for the ad set.'
          },
          campaign_id: {
            type: 'string',
            description: 'The ID of the campaign to which the ad set belongs.'
          },
          bid_strategy: {
            type: 'string',
            description: 'The bid strategy for the ad set.'
          }
        },
        required: ['name', 'objective', 'billing_event', 'status', 'targeting', 'daily_budget', 'campaign_id', 'bid_strategy']
      }
    }
  }
};

export { apiTool };