/**
 * Function to create an ad for an awareness campaign using the Facebook Marketing API.
 *
 * @param {Object} args - Arguments for creating the ad.
 * @param {string} args.account_id - The ad account ID.
 * @param {string} args.ps_adset_id_traffic - The ad set ID for the traffic campaign.
 * @param {string} args.adcreatives2 - The creative ID for the ad.
 * @returns {Promise<Object>} - The result of the ad creation.
 */
const executeFunction = async ({ account_id, ps_adset_id_traffic, adcreatives2 }) => {
  const baseUrl = 'https://graph.facebook.com/v12.0';
  const token = process.env.FACEBOOK_MARKETING_API_API_KEY;
  try {
    // Construct the URL for the ad creation
    const url = `${baseUrl}/act_${account_id}/ads?name=PostManAdTraffic&adset_id=${ps_adset_id_traffic}&status=PAUSED&creative={"creative_id":${adcreatives2}}`;

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
    console.error('Error creating ad for awareness campaign:', error);
    return { error: 'An error occurred while creating the ad for the awareness campaign.' };
  }
};

/**
 * Tool configuration for creating an ad for an awareness campaign using the Facebook Marketing API.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'CreateAdForAwarenessCampaign',
      description: 'Create an ad for an awareness campaign on Facebook.',
      parameters: {
        type: 'object',
        properties: {
          account_id: {
            type: 'string',
            description: 'The ad account ID.'
          },
          ps_adset_id_traffic: {
            type: 'string',
            description: 'The ad set ID for the traffic campaign.'
          },
          adcreatives2: {
            type: 'string',
            description: 'The creative ID for the ad.'
          }
        },
        required: ['account_id', 'ps_adset_id_traffic', 'adcreatives2']
      }
    }
  }
};

export { apiTool };