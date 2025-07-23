/**
 * Function to retrieve attribution settings from the Facebook Marketing API.
 *
 * @param {Object} args - Arguments for the attribution settings request.
 * @param {string} args.account_id - The Ad Account ID to retrieve insights for.
 * @param {string} args.token - The Bearer token for authentication.
 * @returns {Promise<Object>} - The result of the attribution settings request.
 */
const executeFunction = async ({ account_id }) => {
  const base_url = 'https://graph.facebook.com/v12.0';
  const token = process.env.FACEBOOK_MARKETING_API_API_KEY;
  try {
    // Construct the URL with query parameters
    const url = new URL(`${base_url}/act_${account_id}/insights`);
    url.searchParams.append('use_unified_attribution_setting', 'true');
    url.searchParams.append('async', 'true');
    url.searchParams.append('level', 'ad');
    url.searchParams.append('date_preset', 'this_year');
    url.searchParams.append('breakdowns', 'product_id');
    url.searchParams.append('limit', '100');
    url.searchParams.append('action_breakdowns', 'action_type,action_destination');
    url.searchParams.append('action_attribution_windows', '["1d_click","7d_click","28d_click","1d_view","7d_view","28d_view"]');
    url.searchParams.append('fields', 'date_start,date_stop,account_id,account_name,ad_id,ad_name,adset_id,adset_name,campaign_id,campaign_name,actions,unique_actions,action_values,impressions,clicks,unique_clicks,spend,frequency,inline_link_clicks,inline_post_engagement,reach,website_ctr,video_thruplay_watched_actions,video_avg_time_watched_actions,video_p25_watched_actions,video_p50_watched_actions,video_p75_watched_actions,video_p95_watched_actions,video_p100_watched_actions,video_30_sec_watched_actions,video_play_actions,video_continuous_2_sec_watched_actions,unique_video_continuous_2_sec_watched_actions,estimated_ad_recallers,estimated_ad_recall_rate,unique_outbound_clicks,outbound_clicks,conversions,conversion_values,social_spend');
    url.searchParams.append('time_increment', '1');
    url.searchParams.append('format', 'json');

    // Set up headers for the request
    const headers = {
      'Authorization': `Bearer ${token}`
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
    console.error('Error retrieving attribution settings:', error);
    return { error: 'An error occurred while retrieving attribution settings.' };
  }
};

/**
 * Tool configuration for retrieving attribution settings from the Facebook Marketing API.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'AttributionSetting',
      description: 'Retrieve attribution settings from the Facebook Marketing API.',
      parameters: {
        type: 'object',
        properties: {
          account_id: {
            type: 'string',
            description: 'The Ad Account ID to retrieve insights for.'
          }
        },
        required: ['account_id']
      }
    }
  }
};

export { apiTool };