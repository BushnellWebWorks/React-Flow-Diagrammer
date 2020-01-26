var masterPlan = {
  "start": "_8e8d930d575e174ffe93ee6",
  "blueprint": [
    {
      "nodes": {
        "_18cd04d3f05e17501383fdc": {
          "tag": "_18cd04d3f05e17501383fdc",
          "type": "decision",
          "exits": [
            {
              "tag": "_a02eb75aba5e174fee06823",
            },
            {
              "tag": "_fdde47aed25e17503095110",
            },
            {
              "tag": "_a74b01d5065e17504d773f8",
            },
            {
              "tag": "_8e8d930d575e174ffe93ee6",
            }
          ],
          "groupID": "Browse Shoes",
          "label": "=Shoes",
        },
        "_1b81b3bb825e1754463259b": {
          "tag": "_1b81b3bb825e1754463259b",
          "type": "decision",
          "exits": [
            {
              "tag": "",
            }
          ],
          "groupID": "Browse Clothing",
          "label": "Clothes.Dresses",
        },
        "_1b9b1154dc5e17553fa3ba0": {
          "tag": "_1b9b1154dc5e17553fa3ba0",
          "type": "decision",
          "exits": [
            {
              "tag": "",
            }
          ],
          "groupID": "Browse Clothing",
          "label": "Clothes.Jackets",
        },
        "_664f359c1c5e1756cd9f946": {
          "tag": "_664f359c1c5e1756cd9f946",
          "type": "decision",
          "exits": [
            {
              "tag": "_8e8d930d575e174ffe93ee6",
            },
            {
              "tag": "_a02eb75aba5e174fee06823",
            },
            {
              "tag": "_18cd04d3f05e17501383fdc",
            },
            {
              "tag": "_fdde47aed25e17503095110",
            },
            {
              "tag": "_a74b01d5065e17504d773f8",
            }
          ],
          "groupID": "",
          "label": "Convo-thanks",
        },
        "_6ecdbf04e25e17551af23a5": {
          "tag": "_6ecdbf04e25e17551af23a5",
          "type": "decision",
          "exits": [
            {
              "tag": "",
            }
          ],
          "groupID": "Browse Clothing",
          "label": "Clothes.Jeans",
        },
        "_7b82c9aeec5e17547186740": {
          "tag": "_7b82c9aeec5e17547186740",
          "type": "decision",
          "exits": [
            {
              "tag": "",
            }
          ],
          "groupID": "Browse Clothing",
          "label": "Clothes.Tops",
        },
        "_8e8d930d575e174ffe93ee6": {
          "tag": "_8e8d930d575e174ffe93ee6",
          "type": "decision",
          "exits": [
            {
              "tag": "_a02eb75aba5e174fee06823",
            },
            {
              "tag": "_18cd04d3f05e17501383fdc",
            },
            {
              "tag": "_fdde47aed25e17503095110",
            },
            {
              "tag": "_ffcd42e7365e1750baaf259",
            },
            {
              "tag": "_d07e27cf705e1756f7c770c",
            },
            {
              "tag": "_a74b01d5065e17504d773f8",
            }
          ],
          "groupID": "",
          "label": "Welcome",
        },
        "_a02eb75aba5e174fee06823": {
          "tag": "_a02eb75aba5e174fee06823",
          "type": "decision",
          "exits": [
            {
              "tag": "_1b81b3bb825e1754463259b",
            },
            {
              "tag": "_7b82c9aeec5e17547186740",
            },
            {
              "tag": "_6ecdbf04e25e17551af23a5",
            },
            {
              "tag": "_1b9b1154dc5e17553fa3ba0",
            },
            {
              "tag": "_c18018c9c85e175562934c5",
            },
            {
              "tag": "_18cd04d3f05e17501383fdc",
            },
            {
              "tag": "_fdde47aed25e17503095110",
            },
            {
              "tag": "_a74b01d5065e17504d773f8",
            },
            {
              "tag": "_8e8d930d575e174ffe93ee6",
            }
          ],
          "groupID": "Browse Clothing",
          "label": "=Clothing",
        },
        "_a74b01d5065e17504d773f8": {
          "tag": "_a74b01d5065e17504d773f8",
          "type": "decision",
          "exits": [
            {
              "tag": "",
            }
          ],
          "groupID": "",
          "label": "=Orders",
        },
        "_c18018c9c85e175562934c5": {
          "tag": "_c18018c9c85e175562934c5",
          "type": "decision",
          "exits": [
            {
              "tag": "",
            }
          ],
          "groupID": "Browse Clothing",
          "label": "Clothes.Sale",
        },
        "_ce6f83701e5e175ba464601": {
          "tag": "_ce6f83701e5e175ba464601",
          "type": "action",
          "exits": [
            {
              "tag": "_664f359c1c5e1756cd9f946",
            },
            {
              "tag": "_fc090d072f5e1756da5176c",
            }
          ],
          "groupID": "",
          "label": "Connect the Call",
        },
        "_d07e27cf705e1756f7c770c": {
          "tag": "_d07e27cf705e1756f7c770c",
          "type": "action",
          "exits": [
            {
              "tag": "_664f359c1c5e1756cd9f946",
            },
            {
              "tag": "_fc090d072f5e1756da5176c",
            }
          ],
          "groupID": "",
          "label": "=Chat With Agent",
        },
        "_fc090d072f5e1756da5176c": {
          "tag": "_fc090d072f5e1756da5176c",
          "type": "decision",
          "exits": [
            {
              "tag": "_8e8d930d575e174ffe93ee6",
            }
          ],
          "groupID": "",
          "label": "Convo-error",
        },
        "_fdde47aed25e17503095110": {
          "tag": "_fdde47aed25e17503095110",
          "type": "decision",
          "exits": [
            {
              "tag": "_a02eb75aba5e174fee06823",
            },
            {
              "tag": "_18cd04d3f05e17501383fdc",
            },
            {
              "tag": "_a74b01d5065e17504d773f8",
            }
          ],
          "groupID": "Browse Accessories",
          "label": "=Handbags",
        },
        "_ffcd42e7365e1750baaf259": {
          "tag": "_ffcd42e7365e1750baaf259",
          "type": "decision",
          "exits": [
            {
              "tag": "_8e8d930d575e174ffe93ee6",
            },
            {
              "tag": "_ce6f83701e5e175ba464601",
            }
          ],
          "groupID": "",
          "label": "=Phone Call",
        }
      },
      "label": "__root"
    }
  ]
}
