let razorpay=require("razorpay");
const RazorpayConfig={
    key_id: 'rzp_test_SktkXcZ8j1db1A',
    key_secret: 'wt7mt26aSebdQwdbFpkVKrXn'
}

var instance = new razorpay(RazorpayConfig);

module.exports.config=RazorpayConfig;
module.exports.instance=instance;