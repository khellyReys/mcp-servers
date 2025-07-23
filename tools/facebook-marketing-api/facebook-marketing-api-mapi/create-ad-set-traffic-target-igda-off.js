/**
 * Function to create an ad set for traffic targeting on Instagram using the Facebook Marketing API.
 *
 * @param {Object} args - Arguments for creating the ad set.
 * @param {string} args.account_id - The ad account ID.
 * @param {string} args.campaign_id - The campaign ID to associate with the ad set.
 * @param {string} args.token - The access token for authentication.
 * @returns {Promise<Object>} - The result of the ad set creation.
 */
const executeFunction = async ({ account_id, campaign_id }) => {
  const baseUrl = ''; // Base URL for the Facebook Marketing API
  const token = process.env.FACEBOOK_MARKETING_API_API_KEY;

  const url = `${baseUrl}/act_${account_id}/adsets?campaign_id=${campaign_id}&name=PostMancAdsetTrafficCampaignTargetIG&billing_event=LINK_CLICKS&targeting={"age_max":25,"age_min":22,"geo_locations":{"countries":["NP"],"location_types":["home"]},"genders":[1],"publisher_platforms":["instagram"]}&start_time=2024-06-16T04:45:17+0000&status=PAUSED&dynamic_creative_optimization_mode=OFF`;

  try {
    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };

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
 * Tool configuration for creating an ad set for traffic targeting on Instagram.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'CreateAdSetTrafficTargetIGDAOff',
      description: 'Create an ad set for traffic targeting on Instagram.',
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
          }
        },
        required: ['account_id', 'campaign_id']
      }
    }
  }
};

export { apiTool };