import type { BlockItemFragment, Maybe } from '@fuel-explorer/graphql';
import { Card, Flex, VStack, Grid, Address } from '@fuels/ui';
import { IconChecklist } from '@tabler/icons-react';
import { bn } from 'fuels';
import NextLink from 'next/link';
import { CardInfo } from '~/systems/Core/components/CardInfo/CardInfo';
import { TxCard } from '~/systems/Transaction/component/TxCard/TxCard';

type BlockScreenSimpleProps = {
  block?: Maybe<BlockItemFragment>;
  producer: Maybe<string>;
};

export function BlockScreenSimple({ block, producer }: BlockScreenSimpleProps) {
  return (
    <VStack className="px-4 desktop:px-0">
      <Grid
        className="my-6 grid-rows-4 tablet:grid-rows-1 tablet:grid-cols-4"
        gap="3"
      >
        <CardInfo name="Producer" className="flex-1">
          <Address
            value={producer || ''}
            className="[&_button]:text-color [&_svg]:text-color [&_button]:text-base"
          >
            <Address.Link as={NextLink} href={`/account/${producer}`}>
              View Account
            </Address.Link>
          </Address>
        </CardInfo>
        <CardInfo
          name="Created"
          description={block?.time?.full}
          className="flex-1"
        >
          {block?.time?.fromNow}
        </CardInfo>
        <CardInfo name="Gas spent (gwei)" className="flex-1">
          {bn(block?.totalGasUsed).format()}
        </CardInfo>
        <CardInfo name="# of transactions" className="flex-1">
          {block?.header.transactionsCount}
        </CardInfo>
      </Grid>
      <Flex className="border-b border-border pb-4">
        <Card>
          <Card.Body>
            <Flex>
              <IconChecklist /> Transactions
            </Flex>
          </Card.Body>
        </Card>
      </Flex>
      <Grid
        className="grid-cols-1 tablet:grid-cols-2 tablet:grid-cols-2 laptop:grid-cols-3"
        gap="6"
      >
        {block?.transactions.map((transaction) => (
          <TxCard key={transaction.id} transaction={transaction} />
        ))}
      </Grid>
    </VStack>
  );
}