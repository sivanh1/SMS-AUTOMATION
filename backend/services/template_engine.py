def generate_sms_preview(
    template,
    customer
):

    preview = template

    for key, value in customer.items():

        # DEFAULT VALUES
        if key == "cust_name":

            if not value:

                value = "Customer"

        else:

            if value is None or value == "":

                value = "-"

        preview = preview.replace(

            f"${key}",

            str(value)
        )

    return preview