/**
 * Function to create an ad set in the Facebook Marketing API.
 *
 * @param {Object} args - Arguments for creating the ad set.
 * @param {string} args.account_id - The ad account ID.
 * @param {string} args.campaign_id - The campaign ID to associate with the ad set.
 * @param {string} args.token - The bearer token for authentication.
 * @param {string} [args.name="PostMancAdsetTrafficCampaignTargetIG"] - The name of the ad set.
 * @param {string} [args.billing_event="LINK_CLICKS"] - The billing event for the ad set.
 * @param {string} [args.targeting] - The targeting criteria in JSON format.
 * @param {string} [args.start_time="2024-06-16T04:45:17+0000"] - The start time for the ad set.
 * @param {string} [args.status="PAUSED"] - The status of the ad set.
 * @returns {Promise<Object>} - The result of the ad set creation.
 */
const executeFunction = async ({ account_id, campaign_id, token, name = "PostMancAdsetTrafficCampaignTargetIG", billing_event = "LINK_CLICKS", targeting, start_time = "2024-06-16T04:45:17+0000", status = "PAUSED" }) => {
  const baseUrl = ''; // Base URL will be provided by the user
  const url = `${baseUrl}/act_${account_id}/adsets?campaign_id=${campaign_id}&name=${encodeURIComponent(name)}&billing_event=${billing_event}&targeting=${encodeURIComponent(targeting)}&start_time=${start_time}&status=${status}`;
  
  const headers = {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error creating ad set:', error);
    return { error: 'An error occurred while creating the ad set.' };
  }
};

/**
 * Tool configuration for creating an ad set in the Facebook Marketing API.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'CreateAdSetTrafficTargetPlatform',
      description: 'Create an ad set in the Facebook Marketing API.',
      parameters: {
        type: 'object',
        properties: {
          account_id: {
            type: 'string',
            description: 'The ad account ID.'
          },
          campaign_id: {
            type: 'string',
            description: 'The campaign ID to associate with the ad set.'
          },
          token: {
            type: 'string',
            description: 'The bearer token for authentication.'
          },
          name: {
            type: 'string',
            description: 'The name of the ad set.'
          },
          billing_event: {
            type: 'string',
            description: 'The billing event for the ad set.'
          },
          targeting: {
            type: 'string',
            description: 'The targeting criteria in JSON format.'
          },
          start_time: {
            type: 'string',
            description: 'The start time for the ad set.'
          },
          status: {
            type: 'string',
            description: 'The status of the ad set.'
          }
        },
        required: ['account_id', 'campaign_id', 'token', 'targeting']
      }
    }
  }
};

export { apiTool };