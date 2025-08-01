/**
 * Function to create an ad set for traffic conversion impressions on Facebook Marketing API.
 *
 * @param {Object} args - Arguments for creating the ad set.
 * @param {string} args.account_id - The ad account ID.
 * @param {string} args.campaign_id_traffic - The campaign ID for the traffic ad set.
 * @param {string} [args.name="PostMancAdsetTrafficCampaign"] - The name of the ad set.
 * @param {number} [args.bid_amount=500] - The bid amount for the ad set.
 * @param {number} [args.daily_budget=10000] - The daily budget for the ad set.
 * @param {string} [args.start_time="2024-06-16T04:45:17+0000"] - The start time for the ad set.
 * @param {string} [args.status="PAUSED"] - The status of the ad set.
 * @returns {Promise<Object>} - The result of the ad set creation.
 */
const executeFunction = async ({ account_id, campaign_id_traffic, name = "PostMancAdsetTrafficCampaign", bid_amount = 500, daily_budget = 10000, start_time = "2024-06-16T04:45:17+0000", status = "PAUSED" }) => {
  const baseUrl = ''; // will be provided by the user
  const token = process.env.FACEBOOK_MARKETING_API_API_KEY;
  try {
    // Construct the URL with query parameters
    const url = new URL(`${baseUrl}/act_${account_id}/adsets`);
    url.searchParams.append('campaign_id', campaign_id_traffic);
    url.searchParams.append('name', name);
    url.searchParams.append('billing_event', 'IMPRESSIONS');
    url.searchParams.append('bid_amount', bid_amount.toString());
    url.searchParams.append('daily_budget', daily_budget.toString());
    url.searchParams.append('targeting', JSON.stringify({
      age_max: 65,
      age_min: 18,
      geo_locations: {
        countries: ['US'],
        location_types: ['home']
      }
    }));
    url.searchParams.append('start_time', start_time);
    url.searchParams.append('status', status);

    // Set up headers for the request
    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };

    // Perform the fetch request
    const response = await fetch(url.toString(), {
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
 * Tool configuration for creating an ad set for traffic conversion impressions on Facebook Marketing API.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'CreateAdSetTrafficConversionImpressions',
      description: 'Create an ad set for traffic conversion impressions on Facebook Marketing API.',
      parameters: {
        type: 'object',
        properties: {
          account_id: {
            type: 'string',
            description: 'The ad account ID.'
          },
          campaign_id_traffic: {
            type: 'string',
            description: 'The campaign ID for the traffic ad set.'
          },
          name: {
            type: 'string',
            description: 'The name of the ad set.'
          },
          bid_amount: {
            type: 'integer',
            description: 'The bid amount for the ad set.'
          },
          daily_budget: {
            type: 'integer',
            description: 'The daily budget for the ad set.'
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
        required: ['account_id', 'campaign_id_traffic']
      }
    }
  }
};

export { apiTool };