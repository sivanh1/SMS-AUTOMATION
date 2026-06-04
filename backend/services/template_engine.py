def generate_sms_preview(template, customer):

    preview = template

    # CUSTOMER NAME
    cust_name = customer.get(
        "cust_name"
    )

    if not cust_name:

        cust_name = "Customer"

    # AMOUNT
    amount = customer.get(
        "amount"
    )

    if (
        amount is None
        or
        amount == ""
    ):

        amount = "-"

    # DUE DATE
    due_date = customer.get(
        "due_date"
    )

    if not due_date:

        due_date = "-"

    # MOBILE NUMBER
    mobile_number = customer.get(
        "mobile_number",
        ""
    )

    # P_ID
    p_id = customer.get(
        "p_id",
        ""
    )

    preview = preview.replace(
        "$cust_name",
        str(cust_name)
    )

    preview = preview.replace(
        "$amount",
        str(amount)
    )

    preview = preview.replace(
        "$due_date",
        str(due_date)
    )

    preview = preview.replace(
        "$mobile_number",
        str(mobile_number)
    )

    preview = preview.replace(
        "$p_id",
        str(p_id)
    )

    return preview