def generate_sms_preview(template, customer):

    preview = template

    preview = preview.replace(
        "$cust_name",
        str(customer.get("cust_name", ""))
    )

    preview = preview.replace(
        "$amount",
        str(customer.get("amount", ""))
    )

    preview = preview.replace(
        "$due_date",
        str(customer.get("due_date", ""))
    )

    preview = preview.replace(
        "$mobile_number",
        str(customer.get("mobile_number", ""))
    )

    preview = preview.replace(
        "$p_id",
        str(customer.get("p_id", ""))
    )

    return preview